const html = document.querySelector('html')
const focoBt = document.querySelector('.app__card-button--foco')
const curtoBt = document.querySelector('.app__card-button--curto')
const longoBt = document.querySelector('.app__card-button--longo')
const banner = document.querySelector('.app__image')
const titulo = document.querySelector('.app__title')
const botoes = document.querySelectorAll('.app__card-button')
const startPauseBt = document.querySelector('#start-pause')
const iniciarOuPausarBt = document.querySelector('#start-pause span')
const iniciarOuPausarBtIcone = document.querySelector(".app__card-primary-butto-icon") 
const tempoNaTela = document.querySelector('#timer')
const audioTempoFinalizado = new Audio('./sons/beep.mp3')
const customAlert = document.getElementById('customAlert')
const alertMessage = document.getElementById('alertMessage')
const alertOkBtn = document.getElementById('alertOkBtn')

let tempoDecorridoEmSegundos = 25 * 60
let intervaloId = null
let dataInicio = null
let tempoRestanteNoInicio = null // Guarda o tempo que tinha quando começou

focoBt.addEventListener('click', () => {
    zerar() // Para o timer se estiver rodando
    tempoDecorridoEmSegundos = 25 * 60
    alterarContexto('foco')
    focoBt.classList.add('active')
    mostrarTempo()
    atualizarTituloPagina()
})

curtoBt.addEventListener('click', () => {
    zerar()
    tempoDecorridoEmSegundos = 5 * 60
    alterarContexto('descanso-curto')
    curtoBt.classList.add('active')
    mostrarTempo()
    atualizarTituloPagina()
})

longoBt.addEventListener('click', () => {
    zerar()
    tempoDecorridoEmSegundos = 15 * 60
    alterarContexto('descanso-longo')
    longoBt.classList.add('active')
    mostrarTempo()
    atualizarTituloPagina()
})

function alterarContexto(contexto) {
    botoes.forEach(function (contexto){
        contexto.classList.remove('active')
    })
    html.setAttribute('data-contexto', contexto)
    banner.setAttribute('src', `/imagens/${contexto}.png`)
    switch (contexto) {
        case "foco":
            titulo.innerHTML = `
            Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>
            `
            break;
        case "descanso-curto":
            titulo.innerHTML = `
            Que tal dar uma respirada? <strong class="app__title-strong">Faça uma pausa curta!</strong>
            ` 
            break;
        case "descanso-longo":
            titulo.innerHTML = `
            Hora de voltar à superfície.<strong class="app__title-strong"> Faça uma pausa longa.</strong>
            `
        default:
            break;
    }
}

function atualizarTituloPagina() {
    const minutos = Math.floor(tempoDecorridoEmSegundos / 60)
    const segundos = tempoDecorridoEmSegundos % 60
    const tempoFormatado = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`
    document.title = `(${tempoFormatado})`
}

function atualizarTempoReal() {
    if (!dataInicio) return
    
    const agora = new Date().getTime()
    const diferencaEmSegundos = Math.floor((agora - dataInicio) / 1000)
    let novoTempo = tempoRestanteNoInicio - diferencaEmSegundos
    
    if (novoTempo <= 0) {
        audioTempoFinalizado.play()

        mostrarAlerta('Tempo finalizado!', () => {
            location.reload() 
        })
    
    } else {
        tempoDecorridoEmSegundos = novoTempo
        mostrarTempo()
        atualizarTituloPagina()
    }
}

function iniciarTimer() {
    dataInicio = new Date().getTime()
    tempoRestanteNoInicio = tempoDecorridoEmSegundos
    intervaloId = setInterval(() => {
        atualizarTempoReal()
    }, 100)
}

function pausarTimer() {
    if (dataInicio) {
        atualizarTempoReal()
    }
    clearInterval(intervaloId)
    intervaloId = null
    dataInicio = null
    tempoRestanteNoInicio = null
}

startPauseBt.addEventListener('click', () => {
    if(intervaloId){
        pausarTimer()
        iniciarOuPausarBt.textContent = "Começar"
        iniciarOuPausarBtIcone.setAttribute('src', `/imagens/play_arrow.png`)
        return
    }
    iniciarTimer()
    iniciarOuPausarBt.textContent = "Pausar"
    iniciarOuPausarBtIcone.setAttribute('src', `/imagens/pause.png`)
})

function zerar() {
    pausarTimer()
    iniciarOuPausarBt.textContent = "Começar"
    iniciarOuPausarBtIcone.setAttribute('src', `/imagens/play_arrow.png`)
}

function mostrarTempo() {
    const minutos = Math.floor(tempoDecorridoEmSegundos / 60)
    const segundos = tempoDecorridoEmSegundos % 60
    const tempoFormatado = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`
    tempoNaTela.innerHTML = tempoFormatado
}

function mostrarAlerta(mensagem, callback) {
    alertMessage.textContent = mensagem
    customAlert.style.display = 'flex'
    
    alertOkBtn.replaceWith(alertOkBtn.cloneNode(true))
    const novoBtn = document.getElementById('alertOkBtn')
    
    novoBtn.addEventListener('click', () => {
        customAlert.style.display = 'none'
        if (callback) callback()
    })
}

document.addEventListener('visibilitychange', () => {
    if (!document.hidden && intervaloId) {
        atualizarTempoReal()
    }
})

mostrarTempo()
atualizarTituloPagina()