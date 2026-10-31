<script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
  import { useKeycloakContext } from '@/login/core/adapters/kc-ctx';

  const { locale } = useKeycloakContext();
  const supported = computed(() => locale.supported || []);
  const currentTag = computed(() => (locale.current || 'es').substring(0, 2).toLowerCase());
  
  const currentItem = computed(() => {
    return supported.value.find(l => (l.languageTag || '').toLowerCase().startsWith(currentTag.value)) || {
      label: locale.currentLabel || 'Español',
      languageTag: currentTag.value
    };
  });

  const isOpen = ref(false);
  const dropdownRef = ref(null);

  const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
  };

  const closeDropdown = () => {
    isOpen.value = false;
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
      isOpen.value = false;
    }
  };

  onMounted(() => {
    window.addEventListener('click', handleClickOutside);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('click', handleClickOutside);
  });
</script>

<template>
  <header v-if="supported.length > 1" class="kc-top-bar">
    <div class="kc-locale-switcher" ref="dropdownRef">
      
      <!-- MODE A: Compact Pills (When exactly 2 languages: ES | EN) -->
      <div v-if="supported.length <= 2" class="kc-locale-pills">
        <svg class="kc-globe-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <a
          v-for="l in supported"
          :key="l.languageTag || l.label"
          :href="l.url"
          class="kc-locale-pill-btn"
          :class="{ 'is-active': (l.languageTag || '').toLowerCase().startsWith(currentTag) }"
          :title="l.label"
        >
          {{ (l.languageTag || l.label).toUpperCase().substring(0, 2) }}
        </a>
      </div>

      <!-- MODE B: Adaptive Dropdown (When N > 2 languages) -->
      <div v-else class="kc-locale-dropdown-wrapper">
        <button
          type="button"
          class="kc-locale-dropdown-trigger"
          @click.stop="toggleDropdown"
          :aria-expanded="isOpen"
        >
          <svg class="kc-globe-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="kc-locale-trigger-label">{{ currentItem.label }}</span>
          <svg class="kc-dropdown-arrow" :class="{ 'is-open': isOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Dropdown Menu List with scroll for N items -->
        <transition name="kc-fade">
          <div v-if="isOpen" class="kc-locale-menu">
            <a
              v-for="l in supported"
              :key="l.languageTag || l.label"
              :href="l.url"
              class="kc-locale-menu-item"
              :class="{ 'is-active': (l.languageTag || '').toLowerCase().startsWith(currentTag) }"
              @click="closeDropdown"
            >
              <span>{{ l.label }}</span>
              <svg
                v-if="(l.languageTag || '').toLowerCase().startsWith(currentTag)"
                class="kc-locale-check-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </a>
          </div>
        </transition>
      </div>

    </div>
  </header>
</template>
