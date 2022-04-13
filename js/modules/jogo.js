import { temas } from './temas.js';
import { acoesTelaJogo } from './tela.js';

export default function acoes() {
    const imgsAleatoria = () => {
        // Pega as imagens do arquivo tema
        const arrayImgs = [];
        temas.forEach(tema => {
            tema.imgs.forEach(img => arrayImgs.push(img));
        });

        // Monta o array com as imagens aleatórias
        const arrayImgsAleatoria = [];
        for (let i = 0; i < 20; i++) {
            const numeroAleatorio = Math.floor(Math.random() * arrayImgs.length);
            arrayImgsAleatoria.push(arrayImgs[numeroAleatorio]);
        };

        // Chama o método que lista a estrutura html da carta
        acoesTelaJogo.listarCarta(arrayImgsAleatoria.length);

        // Chama o método que preenche as cartas com as imgs
        acoesTelaJogo.preencherCarta(arrayImgsAleatoria, []);
    }

    const liberarBtnJogar = () => {
        const selectTema = acoesTelaJogo.elementosDom.selecionarElemento('.select-tema span');
        const selectDificuldade = acoesTelaJogo.elementosDom.selecionarElemento('.select-dificuldade span');
        const btnJogar = acoesTelaJogo.elementosDom.selecionarElemento('.btn-jogar');

        // Verifica se pode liberar o botão de jogar
        const handleMutation = () => {
            if (selectDificuldade.hasAttribute('data-selecionado') && selectTema.hasAttribute('data-selecionado')) {
                acoesTelaJogo.elementosDom.classListElement(btnJogar, 'remove', 'btn-jogar-desativado');
                btnJogar.setAttribute('dados-partida', `${selectTema.getAttribute('data-selecionado')}|${selectDificuldade.getAttribute('data-selecionado')}`);
            }
        }

        // Adiciona o observer nos select
        const observerTema = new MutationObserver(handleMutation);
        const observerDificuldade = new MutationObserver(handleMutation);

        // Configura os observer
        observerTema.observe(selectTema, { attributes: true });
        observerDificuldade.observe(selectDificuldade, { attributes: true });
    }

    const comecarJogo = () => {
        let pontos = 0;
        let restantes = 10;
        const preencherCartasTema = temaValor => {
            // Pega as imagens relacionadas ao tema escolhido
            const imgsTema = [];
            temas.forEach(tema => {
                const temaLimpo = tema.nome.toLowerCase();
                if (temaValor === temaLimpo) {
                    tema.imgs.forEach(img => imgsTema.push(img));
                }
            });

            // Gera um array de números para servir como index
            const arrayIndexAleatorio = [];
            const tamanhoArray = () => arrayIndexAleatorio.length;
            for (let i = 0; i < imgsTema.length; i++) {
                arrayIndexAleatorio.push(i);
                arrayIndexAleatorio.push(i);
            }

            // Embaralha o array de index trocando os elementos de posição
            for (let i = 0; i < tamanhoArray(); i++) {
                const indexAleatorio = Math.floor(Math.random() * tamanhoArray());
                const elementoAleatorio = arrayIndexAleatorio[indexAleatorio];

                arrayIndexAleatorio[indexAleatorio] = arrayIndexAleatorio[i];
                arrayIndexAleatorio[i] = elementoAleatorio;
            }

            // Chama o método que preenche as cartas com sua imagen e index
            acoesTelaJogo.preencherCarta(imgsTema, arrayIndexAleatorio);
        }
        const eventoCartas = (dificuldade, carta) => {
            // Seleciona as cartas já virada
            const cartasVirada = () => Array.from(acoesTelaJogo.elementosDom.selecionarElementos('.virar'));

            // Verifica se um par já está virado
            const verificarAgora = () => (cartasVirada().length === 2);

            // Impede que o usuário selecione mais de duas cartas
            (!verificarAgora()) ? acoesTelaJogo.elementosDom.classListElement(carta, 'add', 'virar') : '';

            const estadoJogo = () => {
                const cartasDesativadas = document.querySelectorAll('.carta-desativada');
                if (cartasDesativadas.length === 20) {
                    acoesTelaJogo.elementosDom.classListElement(acoesTelaJogo.elementosDom.selecionarElemento('.btn-novo-jogo'), 'add', 'btn-novo-jogo-atencao');
                    acoesTelaJogo.elementosDom.classListElement(acoesTelaJogo.elementosDom.selecionarElemento('.titulo'), 'remove', 'titulo-desativado');
                    acoesTelaJogo.alterarInformacao(acoesTelaJogo.elementosDom.selecionarElemento('.titulo'), 'Heróis econtrados');
                }
            }

            // Verifica se é ou não um par
            const verificarElementos = () => {
                const indexsCartas = cartasVirada().map(cartaVirada => cartaVirada.getAttribute('data-carta-id'));
                if (indexsCartas[0] === indexsCartas[1]) {
                    restantes--;
                    pontos++;
                    acoesTelaJogo.alterarInformacao('[dados-partida="restantes"]', `${restantes} pares`);
                    acoesTelaJogo.alterarInformacao('[dados-partida="pontos"]', `${pontos} pts`);
                    cartasVirada().forEach(carta => {
                        acoesTelaJogo.elementosDom.classListElement(carta, 'add', 'virar-desativado');
                        acoesTelaJogo.elementosDom.classListElement(carta, 'add', 'carta-desativada');
                        acoesTelaJogo.elementosDom.classListElement(carta, 'remove', 'js-inativo');
                        acoesTelaJogo.elementosDom.classListElement(carta, 'remove', 'virar');
                        acoesTelaJogo.elementosDom.classListElement(acoesTelaJogo.elementosDom.selecionarElemento('.fundo-escuro', carta), 'remove', 'js-inativo');
                    });
                    estadoJogo();
                } else {
                    setTimeout(() => {
                        cartasVirada().forEach(carta => acoesTelaJogo.elementosDom.classListElement(carta, 'remove', 'virar'));
                    }, dificuldade);
                }
            };

            // Caso um par já está virado é chamado o método que verifica se o par está correto ou não
            (verificarAgora()) ? verificarElementos() : '';
        }

        // Adiciona o evento no botão de começar o jogo
        acoesTelaJogo.elementosDom.selecionarElemento('.btn-jogar').addEventListener('click', e => {
            // Verifica se o botão de jogar já está ativo
            if (!(acoesTelaJogo.elementosDom.selecionarElemento('.btn-jogar').classList.contains('btn-jogar-desativado'))) {
                // Inicio o cronometro de tempo
                console.log(acoesTelaJogo.cronometroTempo());
                //Remove o fundo que altera a forma do cursor
                acoesTelaJogo.elementosDom.fundoEscuroArray()
                    .forEach(fundoEscuro => acoesTelaJogo.elementosDom.classListElement(fundoEscuro, 'add', 'js-inativo'));

                // Esconde as cartas
                document.querySelectorAll('.carta').forEach(carta => {
                    acoesTelaJogo.elementosDom.classListElement(carta, 'remove', 'virar');
                    acoesTelaJogo.elementosDom.classListElement(carta, 'remove', 'carta-desativada');
                }
                );

                // Pega o tema e a dificuldade escolhida
                const btn = e.target;
                const tema = btn.getAttribute('dados-partida').split('|')[0];
                const dificuldade = +btn.getAttribute('dados-partida').split('|')[1];
                switch (dificuldade) {
                    case 250:
                        acoesTelaJogo.alterarInformacao('[dados-partida="dificuldade"]', 'Difícil');
                        break;

                    case 500:
                        acoesTelaJogo.alterarInformacao('[dados-partida="dificuldade"]', 'Médio');
                        break;
                    case 1000:
                        acoesTelaJogo.alterarInformacao('[dados-partida="dificuldade"]', 'Fácil');

                    default:
                        console.log('Erro ao escolher a dificuldade');
                        break;
                }
                // Adiciona o evento de clique nas cartas
                document.querySelectorAll('.carta').forEach(carta => carta.addEventListener('click', () => { eventoCartas(dificuldade, carta) }));

                preencherCartasTema(tema);

                // Ajusta o menu lateral mostrando as informações da partida
                acoesTelaJogo.elementosDom.ajustesInicioJogo();
            }
        });

        // Adicionar o evento no botão de desistir
        acoesTelaJogo.elementosDom.selecionarElemento('.btn-novo-jogo').addEventListener('click', () => window.location.reload());

    }

    imgsAleatoria();
    liberarBtnJogar();
    comecarJogo();
}