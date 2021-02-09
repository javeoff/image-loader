function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}

const element = (tag, classes = [], content) => {
    const node = document.createElement(tag)

    if (classes.length) {
        node.classList.add(...classes)
    }

    if (content) {
        node.textContent = content
    }

    return node
}

export function upload(selector, options = {}) {
    let files_data = []

    const onUpload = options.onUpload ?? function() {}
    const input = document.querySelector(selector)
    const preview = element('div', ['preview'])
    const button_open = element('button', ['active'], 'Открыть')
    const button_upload = element('button', ['load'], 'Загрузить')
    button_upload.style.display = 'none'

    if (options.multi) {
        input.setAttribute('multiple', true)
    }

    if (options.accept && Array.isArray(options.accept)) {
        input.setAttribute('accept', options.accept.join(','))
    }

    input.insertAdjacentElement('afterend', preview)
    input.insertAdjacentElement('afterend', button_upload)
    input.insertAdjacentElement('afterend', button_open)

    const triggerInput = () => input.click()

    const changeHandler = (e) => {
        if (!e.target.files.length) {
            return
        }

        const { files } = e.target
        files_data = Array.from(files)
        preview.innerHTML = ''
        button_upload.style.display = 'inline'

        files_data.forEach(file => {
            if (!file.type.match('image')) {
                return
            }

            const reader = new FileReader()
            reader.onload = e => {
                console.log(e);
                preview.insertAdjacentHTML('afterbegin', `
                <div class="prev-img">
                    <div class="prev-remove" data-name="${file.name}">&times;</div>
                    <img src="${e.target.result}" />
                    <div class="prev-info">
                        <span>${file.name}</span>
                        <span>${bytesToSize(file.size)}</span>
                    </div>
                </div>
                `)
            }
            reader.readAsDataURL(file)
        })
    }

    const removeHandler = e => {
        if (!e.target.dataset.name) {
            return
        }

        const { name } = e.target.dataset
        files_data = files_data.filter(file => file.name !== name)

        const block = preview.querySelector(`[data-name="${name}"]`).closest('.prev-img')

        block.classList.add('removing')
        setTimeout(() => block.remove(), 300)

        if (!files_data.length) {
            button_upload.style.display = 'none'
        }
    }

    const clearPreview = el => {
        el.style.bottom = '0px'
        el.innerHTML = `<div class="prev-progress"></div>`
    }

    const uploadHandler = e => {
        preview.querySelectorAll('.prev-remove').forEach(e => e.remove())
        const previewInfo = preview.querySelectorAll('.prev-info')
        previewInfo.forEach(clearPreview)
        onUpload(files_data, previewInfo)
    }

    button_open.addEventListener('click', triggerInput)
    input.addEventListener('change', changeHandler)
    preview.addEventListener('click', removeHandler)
    button_upload.addEventListener('click', uploadHandler)
}