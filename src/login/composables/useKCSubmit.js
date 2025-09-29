export function useKCSubmit() {
    const submitKCForm = ({ action, method, fields }) => {
        const form = document.createElement('form');
        form.method = method;
        form.action = action;

        Object.entries(fields).forEach(([name, value]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
    };

    return { submitKCForm };
}
