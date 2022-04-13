import { confgSelect } from './modules/tela.js';
import acoes from './modules/jogo.js';


confgSelect('.select-tema span', '[data-select="lista-temas"]');
confgSelect('.select-dificuldade span', '[data-select="lista-dificuldades"]');

acoes();