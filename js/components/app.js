const vm = new Vue({
  el: "#app",
  data: {
    produtos: [],
    produto: false,
    carrinho: [],
  },
  filters: {
    // atraves do | numeroPreco, aplica o retorno na varial
    numeroPreco(valor) {
      // transforma em moeda corrente
      return valor.toLocaleString("EU", { style: "currency", currency: "EUR" });
    }
  },
  computed: {
    //fica observando se tem algum produto no carrinho
    //se tiver, faz o loop pelos itens somando os precos
    carrinhoTotal() {
      let total = 0;
      if (this.carrinho.length) {
        this.carrinho.forEach(item => {
          total += item.preco;
        })
      }
      return total;
    }
  },
  methods: {
    fetchProdutos() {
      fetch("./api/produtos.json")
        .then(r => r.json())
        .then(r => {
          this.produtos = r;
        })
    },
    // faz o fecth dos produtos, selecionando através do ID
    fetchProduto(id) {
      fetch(`./api/produtos/${id}/dados.json`)
        .then(r => r.json())
        .then(r => {
          this.produto = r;
        })
    },
    // abre o modal, com o ID selecionado através de @click="abrirModal(item.id)" e :key="item.id"
    abrirModal(id){
      this.fetchProduto(id)
      window.scrollTo({
        top:0,
        behavior: "smooth",
      })
    },
    // fecha o modal comparando o target do click
    fecharModal(event){
      console.log(event.target);
      console.log(event.currentTarget);
      if(event.target === event.currentTarget){
        this.produto = false;
      }
    },
    // Adiciona as informações do item selecionado ao carrinho
    adicionarItem(){
      this.produto.estoque--;
      //Descontroi as informações do produto para ocupar apenas uma variavel 
      const { id, nome, preco } = this.produto;
      this.carrinho.push({ id, nome, preco });
    },
    //Remove o item do carrinho com o metro splicae()
    //O método SPLICE(de que quantidade até que quantidade quer remover)
    removerItem(){
      this.carrinho.splice(0, 1)
    },
    // Verifica o localStorage se tem algo salvo, se tiver, trasnforma novamente em uma lista
    // com o JSON.parse(window.localStorage.carrinho);, e popula o carrinho
    checarLocalStorage(){
      if(window.localStorage.carrinho){
        this.carrinho = JSON.parse(window.localStorage.carrinho);
      }
    }
  },
  watch:{
    // Salva os dados dentro de carrinho no localStorage como STRING através do JSON.stringify(this.carrinho)
    carrinho(){
      window.localStorage.carrinho = JSON.stringify(this.carrinho);
    }
  },
  // faz o fetch do JSON produtos ao ser criado, antes do MOUNT
  created() {
    this.fetchProdutos();
    //Verifica se dados em cache no LocalStorage
    this.checarLocalStorage();
  }
})