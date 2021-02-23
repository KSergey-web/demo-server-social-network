const app = new Vue({
    el: '#app',
    data: {
        title: 'Nestjs Websockets Chat',
        name: '',
        text: '',
        messages: [],
        socket: null,
        socketOptions:null
    },
    methods: {
        sendMessage() {
            if(this.validateInput()) {
                const message = {
                    name: this.name,
                    text: this.text
                }
                this.socket.emit('msgToServer', message)
                this.text = ''
            }
        },
        auth() {
            if(this.validateInput()) {
                const message = {
                    token: this.name
                }
                this.socket.emit('auth', message)
            }
        },
        receivedMessage(message) {
            this.messages.push(message)
        },
        validateInput() {
            return this.name.length > 0
        }
    },
    created() {
        this.socket = io.connect('http://localhost:4000')
        this.socket.on('msgToClient', (message) => {
            console.log(message);
            this.receivedMessage(message)
        })
    }
})