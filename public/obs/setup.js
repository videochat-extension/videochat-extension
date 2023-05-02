let html = chrome.i18n.getMessage('lang') === "en" ?
    'Since version 28, OBS has a built-in <a target="_blank" href="https://github.com/obsproject/obs-websocket">obs-websocket</a> plugin that allows to remotely control OBS. Streamlabs OBS is currently not supported.<br><br><b>You need to go to "Tools" -> "WebSocket Server Settings" -> "Enable WebSocket Server" there, and enter the "Server Password" here:</b><br><br><button id="websocketUrl"><b>url: </b><span id="websocketUrlContent"></span></button><br><button id="password"><b>password: </b><span id="passwordContent"></span></button><br><br>After that, you will be able to use such extension features as displaying the location of the interlocutor directly in the source text in OBS (you must first create a source text named VE_TEXT) and turning on / off the cover image directly in OBS (you must first create an image source named VE_COVER).<br><br><b>Reload the video chat page after entering the OBS password: the connection status will be displayed in the streamer mode settings.</b><br><br>Please note that vpn/adblock may block the connection to OBS.'
    :
    'В OBS с 28-ой версии встроен плагин <a target="_blank" href="https://github.com/obsproject/obs-websocket">obs-websocket</a>, который позволяет удаленно управлять OBS. Streamlabs OBS в настоящее время не поддерживается.<br><br><b>Вам нужно зайти в Сервис -> Настройки obs-websocket, включить там сервер WebSocket и ввести сюда пароль для подключения:</b><br><br><button id="websocketUrl"><b>Адрес: </b><span id="websocketUrlContent"></span></button><br><button id="password"><b>Пароль: </b><span id="passwordContent"></span></button><br><br>После этого вы сможете воспользоваться такими функциями расширения, как вывод локации собеседника прямо в источник-текст в OBS (создайте источник-текст с названием VE_TEXT) и включение/выключение источник-заглушку прямо в OBS (создайте картинку с названием VE_COVER).<br><br><b>Обновите страницу видеочата, когда введете пароль от OBS: статус подключения будет отображен в настройках режиме стримера.</b><br><br>Обратите внимание, что vpn/adblock может блокировать соединение с OBS.'

Swal.fire({
    title: 'OBS setup',
    html: html,
    allowOutsideClick: false,
    didRender: () => {
        chrome.storage.local.get({"obsUrl": "ws://127.0.0.1:4455", "obsPassword": ""}).then((res) => {
            document.getElementById('websocketUrlContent').innerText = res.obsUrl
            document.getElementById('passwordContent').innerText = res.obsPassword.replace(/./g, '*');
        })
        document.getElementById('websocketUrl').onclick = () => {
            let newUrl = prompt('enter url')
            if (newUrl) {
                chrome.storage.local.set({"obsUrl": newUrl})
                document.getElementById('websocketUrlContent').innerText = newUrl
            }
        }
        document.getElementById('password').onclick = () => {
            let newPass = prompt('enter password')
            if (newPass) {
                chrome.storage.local.set({"obsPassword": newPass})
                document.getElementById('passwordContent').innerText = newPass.replace(/./g, '*');
            }
        }
    }
}).then(() => {
    window.close()
})