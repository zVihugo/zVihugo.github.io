class Menu {
  constructor() {
    this.menuElement = document.querySelector('.testeDialog');
    this.aparecerElement = document.querySelector('#meubotao');
    this.desaparecerElement = document.querySelector('.btnSair');
    this.aparecerElement.addEventListener('click', this.aparecer.bind(this));
    this.desaparecerElement.addEventListener('click', this.desaparecer.bind(this));
  }

  aparecer() {
    this.menuElement.style.display = 'block';
  }

  desaparecer() {
    this.menuElement.style.display = 'none';
  }
}

class Postagem {
  constructor(titulo, descricao, imagem, data) {
    this.titulo = titulo;
    this.descricao = descricao;
    this.imagem = imagem;
    this.data = data;
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
    window.addEventListener("load", this.preencherPublicacoes.bind(this));
  }

  adicionar() {
    const titulo = this.addTilt.value;
    const descricao = this.addDesc.value;
    const imagem = this.addImg.value;
    const data = this.addData.value;

    if (titulo === '' || descricao === '' || imagem === '' || data === '') {
      alert('Não é possível criar publicação, existem campos vazios.');
      return;
    }

    this.addTilt.value = '';
    this.addDesc.value = '';
    this.addImg.value = '';
    this.addData.value = '';

    const novaPostagem = new Postagem(titulo, descricao, imagem, data);
    this.publicacoes.push(novaPostagem);
    localStorage.setItem("publicacoes", JSON.stringify(this.publicacoes));

    this.criarElementoPost(novaPostagem);
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
    exl.style.backgroundColor = "brown";
    alterar.style.width = "150px";
    alterar.style.backgroundColor = "grey";

    tilt.innerHTML = postagem.titulo;
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
      menu.aparecer();
      this.addTilt.value = postagem.titulo;
      this.addDesc.value = postagem.descricao;
      this.addImg.value = postagem.imagem;
      this.addData.value = postagem.data;

      this.btnAdd.removeEventListener('click', this.adicionar.bind(this));

      this.btnAdd.addEventListener('click', () => {
        const novoTitulo = this.addTilt.value;
        const novaDescricao = this.addDesc.value;
        const novaImagem = this.addImg.value;
        const novaData = this.addData.value;

        postagem.titulo = novoTitulo;
        postagem.descricao = novaDescricao;
        postagem.imagem = novaImagem;
        postagem.data = novaData;

        localStorage.setItem("publicacoes", JSON.stringify(this.publicacoes));

        this.addTilt.value = '';
        this.addDesc.value = '';
        this.addImg.value = '';
        this.addData.value = '';

        this.btnAdd.removeEventListener('click');
      });
    });

    exl.addEventListener("click", () => {
      const index = this.publicacoes.indexOf(postagem);
      this.publicacoes.splice(index, 1);
      localStorage.setItem("publicacoes", JSON.stringify(this.publicacoes));
      containerPosts.removeChild(post);
    });
  }

  preencherPublicacoes() {
    if (localStorage.getItem("publicacoes")) {
      this.publicacoes = JSON.parse(localStorage.getItem("publicacoes"));
      this.publicacoes.forEach((publicacao) => {
        this.criarElementoPost(publicacao);
      });
    }
  }

  pesquisarPublicacao() {
    const palavraChave = this.caixaTexto.value.toLowerCase();
    const posts = document.querySelectorAll('.post');

    posts.forEach((post) => {
      const conteudo = post.innerHTML.toLowerCase();
      if (conteudo.includes(palavraChave)) {
        const conteudoSublinhado = conteudo.replace(
          new RegExp(palavraChave, 'gi'),
          (match) => `<span class="sublinhado">${match}</span>`
        );
        post.innerHTML = conteudoSublinhado;
      }
    });
  }
}

const menu = new Menu();
const publicacoes = new Publicacoes();

//Projeto Realizado pelos Alunos: Victor Moreira e Gustavo Yuusuke
//Professor: Willian Watanabe