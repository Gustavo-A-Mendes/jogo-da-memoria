const cartasGame = document.querySelectorAll('#game .memory-card');
const cartasAnswer = document.querySelectorAll('#answer .memory-card');

let cartaSelecionada;

let hasFlippedCard = false, lockBoard = false, selecionado = false;

let teste = 0;
let tentativas = 20;

function permitirSelecao() {
  if (lockBoard) return;
  
  cartaSelecionada = this;  
  console.log(cartaSelecionada);    
  cartasGame.forEach(carta => {
    checarCarta(carta);
  });
  tentativas--;
  
  // console.log(tentativas);
  
  checarResultado();
  bloquearCarta();
}

function comecarJogo() {

  cartasDoJogo();
  mostrarTodasCartas();
  ativarCartas()

  const timeValue = 3000;
  const memTime = 30000;
  const gameTime = 30000;
  
 
  setTimeout(() => {
    timer.classList.remove('hidden');
    document.getElementById('btnComecar').hidden = "hidden";
  }, 50);
  
  contagemRegressiva((timeValue/1000), 'timer');
  setTimeout(() => {
    
    timer.classList.add('hidden');
    game.classList.remove('hidden');
    
  }, timeValue);
  
  contagemRegressiva(((timeValue + memTime)/1000), 'game-timer')
  setTimeout(() => {
    timeOver();
  }, (timeValue + memTime));

  contagemRegressiva((timeValue + memTime + gameTime)/1000, 'answer-timer')
  setTimeout(() => {
    resultado();
  }, (timeValue + memTime + gameTime));
}

function checarCarta(carta) {
  let isMatch = cartaSelecionada.children[0].id === carta.children[0].id;
  if (isMatch) {
    teste++;
    return;
  }
}

function checarResultado() {
  if (tentativas == 0) {
    resultado();
  }
}

function cartasCorretas() {  
  cartasAnswer.forEach(carta => {
    carta.children[0].classList.add('incorrect');
    carta.children[1].classList.add('incorrect');
    for (let i = 0; i < cartasGame.length ; i++) {
      let correta = carta.children[0].id === cartasGame[i].children[0].id;
      for (let j = 0; j < 2; j++) {
        if (correta) {
          carta.children[j].classList.remove('incorrect');
          carta.children[j].classList.add('correct');
        }      
      }
    }
  });
}

function bloquearCarta() {
  for (let i = 0; i < 2; i++) {
    cartaSelecionada.children[i].classList.add('selected');
    cartaSelecionada.children[i].classList.remove('hovered');
  }

desativarCartas();
}

function ativarCartas() {
  cartasAnswer.forEach(carta => {
    carta.addEventListener('click', permitirSelecao);
  });
}

function desativarCartas() {
  cartaSelecionada.removeEventListener('click', permitirSelecao);
  resetBoard();
}

function resetBoard() {
  [cartaSelecionada] = [null];
}

function recomecar() {

  cartasGame.forEach(carta => {
    carta.innerHTML = "";
    removerFlip(carta);
  });

  cartasAnswer.forEach(carta => {
    carta.innerHTML = "";
    removerFlip(carta);
  });

  document.querySelector('.final-result').innerHTML = "";

  [lockBoard, tentativas, teste] = [false, 20, 0];

  timer.classList.add('hidden');
  game.classList.add('hidden');
  answer.classList.add('hidden');
  document.getElementById('btnComecar').removeAttribute("hidden");
  
}

function timeOver() {
  game.classList.add('hidden');
  answer.classList.remove('hidden');
} 

function resultado() {
  lockBoard = true;
  
  cartasCorretas();
  
  let h1 = document.createElement('h1');
  h1.classList.add('result');
  h1.textContent = "Você acertou " + teste + " cartas";

  let botao = document.createElement('button');
  botao.setAttribute('onclick', 'recomecar()');
  botao.id = "btnReset";
  botao.textContent = "Recomeçar?";
  let r = document.querySelector('.final-result');
  r.appendChild(h1);
  r.appendChild(botao);
}

function removerFlip(carta) {
  carta.classList.remove('flip');
}


// =============================================
// funções para organizar as cartas

// escolhe as cartas para memorizadas
function cartasDoJogo() {
  let cartasTotal = [...cartas];
  let cartasJogo = [...cartasGame];
  let cartasIniciais = [];
  
  for (let i = 0; i < cartasJogo.length; i++) {
    let id = Math.floor(Math.random() * (cartasTotal.length));
    cartasIniciais.push(cartasTotal[id]);
    cartasTotal.splice(id, 1);
    
    adicionarCarta(cartasIniciais[i], cartasJogo[i]);
  }
  escolherFace(cartasJogo);
};

// mostra todas as cartas para o jogador escolher as certas
function mostrarTodasCartas() {
  let cartasTotal = [...cartas];
  let cartasResposta = [...cartasAnswer];
  
  for (let i = 0; i < cartasTotal.length; i++) {
    adicionarCarta(cartasTotal[i], cartasResposta[i]);
  }
  escolherFace(cartasResposta);
  
  embaralhar(cartasResposta);
};

// função que monta o corpo da carta e adiciona no HTML
function adicionarCarta(inValue, outValue) {
  var img = document.createElement('img');
  img.classList.add('front-face');
  img.classList.add('hovered');
  img.id = inValue.id;
  img.src = inValue.imagem;
  outValue.appendChild(img);
  
  var txt = document.createElement('p');
  txt.classList.add('back-face');
  txt.classList.add('hovered');
  txt.textContent = inValue.nome;
  outValue.appendChild(txt);
}

// função que aleatoriza a face da carta (imagem ou nome)
function escolherFace(cartaArr) {
  cartaArr.forEach(carta => {
    let face = Math.floor(Math.random() * 2);
    if (face) {
      carta.classList.add('flip');
    }
  });
}

// embaralha as cartas escolhidas para memorizar
function embaralhar(arr) {
  arr.forEach(card => {
    let randomPos = Math.floor(Math.random() * arr.length);
    card.style.order = randomPos;
  });
};


// =============================================
// funções para a contagem regressiva
function updateText(text, divID) {
  const formatarTexto = () => `${text}`
  
  const t = document.getElementById(divID);
  t.textContent = formatarTexto();
}

function contagemRegressiva(time, divID) {
  const stopCount = () => clearInterval(id);
  
  const count = () => {
    if (time === 0) {
      stopCount();
    }
    updateText(time, divID);
    time--;
  }
  count();
  const id = setInterval(count, 1000);
}