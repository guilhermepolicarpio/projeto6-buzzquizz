let numQuizzes = 0;
const paginaBase = document.querySelector(".paginaQuizz");

function atualizarPagina(){
    document.location.reload();
}

function carregarPaginaInicial(){

    paginaBase.innerHTML = "";

    paginaBase.innerHTML = `    <div>
                                    <div class="meusQuizzes">
                                        <h3>Você não criou nenhum</br>quizz ainda :(</h3> 
                                        <button onclick="paginaComeco()">Criar Quizz</button>
                                    </div>
                                </div>

                                <div class="todosQuizzes">
                                    <h1>Todos os Quizzes</h1>
                                    <div class="quizzes"></div>
                                </div>`

    carregarQuizzes();
}

function carregarQuizzes(){
    let promise = axios.get('https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes');
    promise.then(renderizarQuizzes);
    promise.catch(alertaErro);
}

function renderizarQuizzes(obj){
    let array = obj.data;
    numQuizzes = array.length;

    let divMeusQuizzes = document.querySelector(".meusQuizzes");
    let divPaiMeusQuizzes = divMeusQuizzes.parentElement;
    let divTodosQuizzes = document.querySelector(".todosQuizzes div");

    for (let i = 0; i < numQuizzes; i++){
        
        let quizz = array[i];

        if (validarIdUsuario(quizz.id)){

            if (document.querySelector(".meusQuizzes") !== null){

                divPaiMeusQuizzes.innerHTML = ` <div class="todosQuizzes">
                                                    <span>
                                                        <h1>Meus Quizzes</h1>
                                                        <ion-icon name="add-circle"
                                                        onclick="paginaComeco()"
                                                        class="botaoAdicionar"></ion-icon>
                                                    </span>
                                                    <div class="quizzes"></div>
                                                </div>`

                divMeusQuizzes = divPaiMeusQuizzes.querySelector(".quizzes");
            }

            let html =  `   <div class="quizz"
                            style="background-image: url('${quizz.image}');"
                            onclick="carregarQuizz(${quizz.id})">
                                <div>${quizz.title}</div>
                            </div>`;

            divMeusQuizzes.innerHTML += html;

        } else {

            let html =  `   <div class="quizz"
                            style="background-image: url('${quizz.image}');"
                            onclick="carregarQuizz(${quizz.id})">
                                <div>${quizz.title}</div>
                            </div>`;

            divTodosQuizzes.innerHTML += html;
        
        }
    }
}

function validarIdUsuario(id){
    //Verificar quais são os IDs dos quizzes criados pelo usuário

    if (id === 4){
        return true;
    } else {
        return false;
    }
}

function alertaErro(obj){
    let id = obj.status
    console.log(`Erro ${id}`);
    alert(`Erro ${id}`);
}

function carregarQuizz(id){
    let promise = axios.get(`https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes/${id}`);
    promise.then(renderizarQuizz);
    promise.catch(alertaErro);
}

function renderizarQuizz(obj){

    let quizz = obj.data;

    paginaBase.innerHTML = "";

    paginaBase.innerHTML = `    <div class="banner" style="background-image: url('${quizz.image}');"> 
                                    <div>
                                        <h1>${quizz.title}</h1>
                                    </div>
                                </div>`;

    let perguntas = quizz.questions;
    
    for (let i = 0; i < perguntas.length; i++){

        let pergunta = perguntas[i]

        paginaBase.innerHTML += `   <div class="pergunta">
                                        <div class="titulo-pergunta" style="background-color: ${pergunta.color};">${pergunta.title}</div>
                                        <div class="resposta-pergunta" data-id="${i}"></div>
                                    </div>`;
      
        let divRespostas = document.querySelector(`[data-id="${i}"]`);
        let respostas = pergunta.answers;

        respostas.sort(comparador);

        for (let i = 0; i < respostas.length; i++){

            let resposta = respostas[i];

            divRespostas.innerHTML += ` <div class="resposta-${resposta.isCorrectAnswer}"
                                        onclick = "selecionarResposta(this)">
                                            <img src="${resposta.image}">
                                            <h2>${resposta.text}</h2>
                                        </div>`
        }


    }

}

function selecionarResposta(divSelecionada) {
    let listaRespostas = divSelecionada.parentElement.querySelectorAll("div");

    for (let i = 0; i < listaRespostas.length; i++){
        let divAnalisada = listaRespostas[i]
        divAnalisada.removeAttribute("onclick");

        let resposta = divAnalisada.classList;

        if (resposta[0] === "resposta-true") {
            divAnalisada.classList.remove("resposta-true");
            divAnalisada.classList.add("cor-true");
        } else {
            divAnalisada.classList.remove("resposta-false");
            divAnalisada.classList.add("cor-false");
        }

        if (divAnalisada !== divSelecionada){
            divAnalisada.classList.add("filtroBranco")
        }
    }

    setTimeout(proximaPergunta, 2000, divSelecionada);
}

function proximaPergunta(divAtual){

    let pergunta = divAtual.parentElement.parentElement

    console.log(pergunta.nextElementSibling);

    pergunta.nextElementSibling.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function comparador() { 
	return Math.random() - 0.5; 
}

carregarPaginaInicial();

//FUNÇÃO PARA CARREGAR UM OBJETO DE QUIZZ SEMPPRE

function AUX (id) {
    let promise = axios.get(`https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes/${id}`);
    promise.then(obj => console.log(obj.data))
}

AUX (1);