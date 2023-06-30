class Dialog {
  constructor() {
    this.dialogElement = document.querySelector('.testeDialog');
    this.aparecerElement = document.querySelector('#meubotao');
    this.desaparecerElement = document.querySelector('.btnSair');
    this.aparecerElement.addEventListener('click', this.aparecer.bind(this));
    this.desaparecerElement.addEventListener('click', this.desaparecer.bind(this));
  }

  aparecer() {
    this.dialogElement.style.display = 'block';
  }

  desaparecer() {
    this.dialogElement.style.display = 'none';
  }
}

class Postagem {
  constructor(titulo, descricao, imagem, data) {
    this.titulo = titulo;
    this.descricao = descricao;
    this.imagem = imagem;
    this.data = data;
    this.indice = -1; // Adicionando o atributo índice para controlar a posição da postagem
  }
}

class Publicacoes {
  constructor() {
    this.conteudoElement = document.querySelector('.container-posts');
    this.btnAdd = document.querySelector('.btnAdd');
    this.addTilt = document.querySelector('.addTilt');
    this.addDesc = document.querySelector('.addDesc');
    this.addImg = document.querySelector('.addImg');
    this.addData = document.querySelector('.addData');
    this.caixaTexto = document.querySelector("#txt");
    this.pesquisar = document.querySelector("#pesquisa");
    this.publicacoes = [];

    this.btnAdd.addEventListener('click', this.adicionar.bind(this));
    this.pesquisar.addEventListener('click', this.pesquisarPublicacao.bind(this));
    window.addEventListener("load", () => {
      this.carregarPublicacoes();
      this.preencherPublicacoes();
    });
  }

  exibirMensagemErro(mensagem) {
    const mensagemErroElement = document.querySelector('.erro');
    mensagemErroElement.textContent = mensagem;
    mensagemErroElement.style.display = 'block';

    setTimeout(() => {
      mensagemErroElement.style.display = 'none';
    }, 3000);
  }

  adicionar() {
    const titulo = this.addTilt.value;
    const descricao = this.addDesc.value;
    const imagem = this.addImg.value;
    const data = this.addData.value;

    if (titulo === '' || descricao === '' || imagem === '' || data === '') {
      this.exibirMensagemErro('Não é possível criar publicação, existem campos vazios.');
      return;
    }

    this.addTilt.value = '';
    this.addDesc.value = '';
    this.addImg.value = '';
    this.addData.value = '';

    const novaPostagem = new Postagem(titulo, descricao, imagem, data);

    // Verifica se a postagem já existe no vetor
    const index = novaPostagem.indice;
    if (index !== -1) {
      this.publicacoes[index] = novaPostagem;
    } else {
      this.publicacoes.push(novaPostagem);
    }

    this.criarElementoPost(novaPostagem);

    this.atualizarLocalStorage();
  }

  criarElementoPost(postagem) {
    const post = document.createElement("div");
    const tilt = document.createElement("h1");
    const de = document.createElement("p");
    const img = document.createElement("img");
    const dataAt = document.createElement("p");
    const exl = document.createElement("button");
    const alterar = document.createElement("button");

    exl.style.width = "150px";
    exl.style.color = "white";
    exl.style.backgroundColor = "brown";
    alterar.style.width = "150px";
    alterar.style.backgroundColor = "grey";

    tilt.innerHTML = postagem.titulo;
    img.alt = postagem.titulo;
    de.innerHTML = postagem.descricao;
    img.src = postagem.imagem;
    img.style.width = "300px";
    dataAt.innerHTML = postagem.data;
    exl.innerHTML = "Excluir";
    alterar.innerHTML = "Alterar";

    post.classList.add("post");
    post.appendChild(img);
    post.appendChild(de);
    post.appendChild(tilt);
    post.appendChild(dataAt);
    post.appendChild(exl);
    post.appendChild(alterar);

    const containerPosts = document.querySelector(".container-posts");
    containerPosts.appendChild(post);

    alterar.addEventListener("click", () => {
      this.alterarPublicacao(postagem);
    });

    exl.addEventListener("click", () => {
      const index = this.publicacoes.indexOf(postagem);
      this.publicacoes.splice(index, 1);
      containerPosts.removeChild(post);
      this.atualizarLocalStorage();
    });
  }

  alterarPublicacao(postagem) {
    dialog.aparecer();
    this.addTilt.value = postagem.titulo;
    this.addDesc.value = postagem.descricao;
    this.addImg.value = postagem.imagem;
    this.addData.value = postagem.data;

    const botaoAlterar = document.createElement('button');
    botaoAlterar.textContent = 'Salvar Alterações';
    botaoAlterar.addEventListener('click', () => {
      const novoTitulo = this.addTilt.value;
      const novaDescricao = this.addDesc.value;
      const novaImagem = this.addImg.value;
      const novaData = this.addData.value;

      postagem.titulo = novoTitulo;
      postagem.descricao = novaDescricao;
      postagem.imagem = novaImagem;
      postagem.data = novaData;

      this.atualizarElementoPost(postagem);

      dialog.desaparecer();

      this.btnAdd.removeEventListener('click', this.adicionar.bind(this));
      this.btnAdd.addEventListener('click', this.adicionar.bind(this));
    });

    const containerForm = document.querySelector('.form-container');
    containerForm.appendChild(botaoAlterar);

    dialog.desaparecer();
  }

  atualizarElementoPost(postagem) {
    const post = document.querySelector('.container-posts');
    const posts = Array.from(post.children);
    const index = this.publicacoes.indexOf(postagem);

    if (index !== -1) {
      const elemento = posts[index];
      const tilt = elemento.querySelector('h1');
      const de = elemento.querySelector('p');
      const img = elemento.querySelector('img');
      const dataAt = elemento.querySelector('p');

      tilt.innerHTML = postagem.titulo;
      de.innerHTML = postagem.descricao;
      img.src = postagem.imagem;
      dataAt.innerHTML = postagem.data;
    }

    this.atualizarLocalStorage();
  }

  preencherPublicacoes() {
    this.publicacoes.forEach((publicacao) => {
      this.criarElementoPost(publicacao);
    });
  }

  carregarPublicacoes() {
    if (localStorage.getItem("publicacoes")) {
      this.publicacoes = JSON.parse(localStorage.getItem("publicacoes"));
    }
  }

  atualizarLocalStorage() {
    localStorage.setItem("publicacoes", JSON.stringify(this.publicacoes));
  }

  pesquisarPublicacao() {
    const palavraChave = this.caixaTexto.value.toLowerCase();
    if (palavraChave.trim() === '') {
      return;
    }
    
    const posts = document.querySelectorAll('.post');
    posts.forEach((post) => {
      const titulo = post.querySelector('h1').innerHTML.toLowerCase();
      const descricao = post.querySelector('p').innerHTML.toLowerCase();
      const conteudo = titulo + descricao;
  
      if (conteudo.includes(palavraChave)) {
        post.style.display = 'block';
      } else {
        post.style.display = 'none';
      }
    });
  }
}
const dialog = new Dialog();
const publicacoes = new Publicacoes();
