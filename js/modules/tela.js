export function confgSelect(contanierSelect, listaSelect) {
    const select = document.querySelector(contanierSelect);
    const lista = document.querySelector(listaSelect);
    const listaOpcs = lista.querySelectorAll('*');

    const controleSelectContanier = e => {
        lista.classList.toggle('js-ativo');
    }

    const controleOpc = e => {
        lista.classList.remove('js-ativo');
        const textoOpc = e.target.innerText;
        const valorOpc = e.target.getAttribute('data-select');
        select.innerText = textoOpc;
        select.setAttribute('data-selecionado', valorOpc);
    }

    listaOpcs.forEach(opc => opc.addEventListener('click', controleOpc));
    select.addEventListener('click', controleSelectContanier);
}
export const acoesTelaJogo = {
    listarCarta: qtdCarta => {
        let htmlEsqueletoCartas = '';
        for (let i = 0; i < qtdCarta; i++) {
            htmlEsqueletoCartas += `
                <div class="carta virar carta-desativada" data-carta-id="null">
                    <div class="fundo-escuro" data-carta="fundo-escuro"></div>
                    <div class="frente">
                        <p>?</p>
                    </div>
                    <div class="verso">
                        <img src="/images/dc/img-1.jpg" alt="###" data-carta="img">
                    </div>
                </div>
            `;
        }

        document.querySelector('.tabuleiro-cartas').innerHTML = htmlEsqueletoCartas;
    },
    preencherCarta: (cartaImgs, cartaIndexs) => {
        const cartas = document.querySelectorAll('.carta');

        cartas.forEach((carta, index) => {
            const indexElemento = (cartaIndexs.length) ? cartaIndexs[index] : index;

            carta.querySelector('[data-carta="img"]').setAttribute('src', cartaImgs[indexElemento]);
            carta.setAttribute('data-carta-id', indexElemento);
        });

    },
    alterarInformacao: function (informacao, valor) {
        this.elementosDom.selecionarElemento(informacao).innerText = valor;
    },
    cronometroTempo: () => {
        let time = 0;
        const intervalCronometro = setInterval(contagemCronometro, 1000);
        function contagemCronometro(){
            time++;
            let hora = Math.floor(time / 3600);
            let minutos = Math.floor((time % 3600) / 60);
            let segundos = Math.floor((time % 3600) % 60);

            hora = (hora < 10)? `0${hora}` : hora
            minutos = (minutos < 10)? `0${minutos}` : minutos
            segundos = (segundos < 10)? `0${segundos}` : segundos


            document.querySelector('[dados-partida="tempo"]').innerText = `${hora}:${minutos}:${segundos}`;
        }
        //const pararCronometro = () => {
        //    console.log('jogo acabou');
        //    clearInterval(intervalCronometro);
        //}

        //return pararCronometro;
    },
    elementosDom: {
        classListElement: (elemento, acao, classe) => elemento.classList[acao](classe),
        selecionarElemento: (elemento, selecao = document) => selecao.querySelector(elemento),
        selecionarElementos: elemento => document.querySelectorAll(elemento),
        fundoEscuroArray: () => document.querySelectorAll('[data-carta="fundo-escuro"]'),
        limparTextoSelect: (selectId, texto) => document.querySelector(selectId).innerText = texto,
        limparAtrtibutoSelect: selectId => document.querySelector(selectId).removeAttribute('data-selecionado'),
        ajustesInicioJogo: function () {
            this.limparTextoSelect('.select-tema span', 'Selecione um tema');
            this.limparTextoSelect('.select-dificuldade span', 'Escolha a dificuldade');

            this.limparAtrtibutoSelect('.select-tema span');
            this.limparAtrtibutoSelect('.select-dificuldade span');

            this.classListElement(this
                .selecionarElemento('.btn-jogar'), 'add', 'btn-jogar-desativado');
            this.selecionarElemento('.btn-jogar')
                .removeAttribute('dados-partida');

            this.classListElement(this
                .selecionarElemento('.informacoes-partida'), 'remove', 'js-inativo');
            this.classListElement(this
                .selecionarElemento('.informacoes-iniciais'), 'add', 'js-inativo');

            this.classListElement(this
                .selecionarElemento('.titulo'), 'add', 'titulo-desativado');

            this.selecionarElemento('.titulo').innerText = 'Achei os heróis!';
        },
    }
};