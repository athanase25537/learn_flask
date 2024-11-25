// Function to scroll to the bottom of a container
function scrollToBottom() {
    var container = document.querySelector('.text_container');
    container.scrollTop = container.scrollHeight;
}

let form_content = document.querySelector('form')
let sent_btn = document.querySelector('svg')
const greeting = document.querySelector('.greeting')
form_content.addEventListener('submit', (e) => {
    e.preventDefault()
    
    greeting.style.display = 'none'
    // message container
    const sms_content = document.querySelector('.text_container')

    // prompt message
    const prompt = document.querySelector('textarea').value;
    if (prompt == '') return

    let file_img = document.getElementById('file').value
    
    formData = new FormData(form_content)
    formData.forEach((value, index, array) => {
        console.log(value)
    })

    file_content = formData.get('file')
    if (file_content.name != '') {
        let reader = new FileReader();
        
        // Quand le fichier est chargé, on crée un élément d'image et on l'affiche
        reader.onload = function(e) {
            let img = document.createElement('img');
            img.src = e.target.result;

            // sent message
            const container_question_img = document.createElement('div')
            container_question_img.classList.add('content_question')
            const new_sent_sms_img = document.createElement('p')
            new_sent_sms_img.classList.add('question', 'has-img')
            new_sent_sms_img.appendChild(img)
            container_question_img.appendChild(new_sent_sms_img)

            sms_content.appendChild(container_question_img)

            const container_question_text = document.createElement('div')
            container_question_text.classList.add('content_question')
            const new_sent_sms_text = document.createElement('p')
            new_sent_sms_text.textContent = prompt
            new_sent_sms_text.classList.add('question')
            container_question_text.appendChild(new_sent_sms_text)
            sms_content.appendChild(container_question_text)

            // remove mini image
            let mini_image_container = document.querySelector('.preview_container')
            if(mini_image_container !== null) mini_image_container.remove()
            let file_data = document.getElementById('file')
            file_data.value = ''

            // received message
            const container_response = document.createElement('div')
            container_response.classList.add('content_response')
            const new_received_sms = document.createElement('p')
            new_received_sms.classList.add('response')
            
            scrollToBottom()

            // create loader
            const div_loader = document.createElement('p')
            div_loader.classList.add('response', 'load')
            let span = document.createElement('span')
            let span1 = document.createElement('span')
            let span2 = document.createElement('span')
            div_loader.appendChild(span)
            div_loader.appendChild(span1)
            div_loader.appendChild(span2)
            container_response.appendChild(div_loader)

            sms_content.appendChild(container_response)
            const loader = document.querySelectorAll('.load span')
            let i = 0
            setInterval(() => {
                loader[i].classList.add('active')
                setTimeout(() => {
                    loader[i].classList.remove('active')
                    i++
                    if(i>(loader.length-1)) i = 0
                }, 300)
            }, 500)

            scrollToBottom()

            p = document.querySelector('textarea');
            p.value = ''

            console.log(formData.get('sms'))
            scrollToBottom()

            fetch('http://127.0.0.1:5000/upload', {
            method: 'POST',
            body: formData
            })
            .then(response => response.json())
            .then(data => {
                div_loader.remove()    
                container_response.appendChild(new_received_sms)
                text_animate(new_received_sms, data.response)
                    
                scrollToBottom()
            })
            .catch(error => {
                console.error('Otran Error:', error);
                document.querySelector('.response').innerText = 'Upload failed';
            })
        };
        
        reader.readAsDataURL(file_content);  // Lire le fichier comme URL de données
        return
    } else {
        // received message
        const container_response = document.createElement('div')
        container_response.classList.add('content_response')
        const new_received_sms = document.createElement('p')
        new_received_sms.classList.add('response')
        
        // sent message
        const container_question = document.createElement('div')
        container_question.classList.add('content_question')
        const new_sent_sms = document.createElement('p')
        new_sent_sms.classList.add('question')
        new_sent_sms.innerText = prompt

        // add sent message on message container
        container_question.appendChild(new_sent_sms)
        sms_content.appendChild(container_question)
        
        scrollToBottom()

        // create loader
        const div_loader = document.createElement('p')
        div_loader.classList.add('response', 'load')
        let span = document.createElement('span')
        let span1 = document.createElement('span')
        let span2 = document.createElement('span')
        div_loader.appendChild(span)
        div_loader.appendChild(span1)
        div_loader.appendChild(span2)
        container_response.appendChild(div_loader)

        sms_content.appendChild(container_response)
        const loader = document.querySelectorAll('.load span')
        let i = 0
        setInterval(() => {
            loader[i].classList.add('active')
            setTimeout(() => {
                loader[i].classList.remove('active')
                i++
                if(i>(loader.length-1)) i = 0
            }, 300)
        }, 500)

        scrollToBottom()

        p = document.querySelector('textarea');
        p.value = ''

        scrollToBottom()


        fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData
        })
        .then(response => response.json())
        .then(data => {
            div_loader.remove()    
            container_response.appendChild(new_received_sms)

            text_animate(new_received_sms, data.response)
            
            scrollToBottom()
        })
        .catch(error => {
        console.error('Error:', error);
        document.querySelector('.response').innerText = 'Upload failed';
        })
    }
                                  
})

document.getElementById('file').addEventListener('change', function(event) {
    let file = event.target.files[0];
    
    if (file) {
        let reader = new FileReader();
        
        // Quand le fichier est chargé, on crée un élément d'image et on l'affiche
        reader.onload = function(e) {
            // container mini img
            let form_data = document.querySelector('form')

            let img = document.createElement('img');
            img.src = e.target.result;
            /*
            <div class="preview-container" style="width=40px; height:40px; padding:5px">
                <div class="cancel">
                    <i class="fa-solid fa-xmark"></i>
                </div>
            </div>
            */
            let div_cancel = document.createElement('div')
            div_cancel.classList.add('cancel')
            let icon = document.createElement('i')
            icon.classList.add('fa-solid', 'fa-xmark')
            div_cancel.appendChild(icon)
            
            // Ajouter l'image au conteneur
            container_img = document.createElement('div');
            container_img.classList.add('preview_container')
            container_img.appendChild(img)
            container_img.appendChild(div_cancel)
            form_data.appendChild(container_img)

            // remove mini image on click cancel button
            div_cancel.addEventListener('click', () => {
                container_img.remove()
                let file_data = document.getElementById('file')
                file_data.value = ''
            })
        };
        
        reader.readAsDataURL(file);  // Lire le fichier comme URL de données
    }
});

let scrolled = true
const sms_content = document.querySelector('.text_container')
function text_animate(container, text) {
    spans = []
    for(i=0; i<text.length; i++) {
        let span = document.createElement('span')
        span.innerText = text[i]
        spans[i] = span
    }

    i = 0
    scrolled = true
    const loop_text = setInterval(() => {
        try {
            container.appendChild(spans[i])
            sms_content.addEventListener('wheel', scroll_to_false)
            
            if(scrolled) scrollToBottom()
            else sms_content.removeEventListener('wheel', scroll_to_false) 
        }
        catch {
            clearInterval(loop_text)
        }
        i++

    }, 50)
}

function scroll_to_false() {
    scrolled = false
}