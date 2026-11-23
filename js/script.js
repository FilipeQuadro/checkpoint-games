/* =========================================================
   Checkpoint Games - script.js (JavaScript puro)
   ========================================================= */

/* ---------- Voltar ao topo: rola a página suavemente até o início ---------- */
function topo() {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
}

/* ---------- Funções para guardar dados no navegador (localStorage) ---------- */
function salvar(chave, valor) {
    try { localStorage.setItem(chave, valor); } catch (e) { /* navegador bloqueou: ignora */ }
}
function ler(chave) {
    try { return localStorage.getItem(chave); } catch (e) { return null; }
}

/* ---------- Login: confere usuário e senha ---------- */
function login() {
    var logado = 0;
    var campoUsuario = document.getElementsByName('usuario')[0];
    var campoSenha = document.getElementById('senha');
    var usuario = campoUsuario.value.trim().toLowerCase();
    var senha = campoSenha.value.trim().toLowerCase();

    if (usuario == "admin" && senha == "123456") {
        logado = 1;
        salvar('usuarioLogado', usuario);
        window.location = "index.html";
    }

    if (logado == 0) {
        // marca os campos em vermelho e mostra o alerta
        campoUsuario.classList.add('is-invalid');
        campoSenha.classList.add('is-invalid');
        alert("Acesso Negado. Dados incorretos");
        campoSenha.value = "";
        campoSenha.focus();
    }
}

/* ---------- Cadastro: valida os campos antes de cadastrar ---------- */
function cadastro() {
    var nome = document.getElementById('nome');
    var email = document.getElementById('email');
    var telefone = document.getElementById('telefone');
    var senha = document.getElementById('nova-senha');
    var confirma = document.getElementById('confirma-senha');
    var caixaErro = document.getElementById('erro-cadastro');
    var erros = [];

    // limpa as marcações anteriores
    [nome, email, telefone, senha, confirma].forEach(function (campo) {
        campo.classList.remove('is-invalid');
    });

    if (nome.value.trim().length < 3) {
        erros.push('Informe seu nome completo.');
        nome.classList.add('is-invalid');
    }
    // confere se o e-mail tem o formato texto@texto.texto
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        erros.push('Informe um e-mail válido.');
        email.classList.add('is-invalid');
    }
    if (telefone.value.replace(/\D/g, '').length < 10) {
        erros.push('Informe um telefone com DDD.');
        telefone.classList.add('is-invalid');
    }
    if (senha.value.length < 6) {
        erros.push('A senha precisa ter pelo menos 6 caracteres.');
        senha.classList.add('is-invalid');
    }
    if (senha.value !== confirma.value || confirma.value === '') {
        erros.push('As senhas não são iguais.');
        confirma.classList.add('is-invalid');
    }

    if (erros.length > 0) {
        caixaErro.innerHTML = erros.join('<br>');
        caixaErro.classList.remove('d-none');
        return;
    }

    caixaErro.classList.add('d-none');
    alert("Cadastrado com sucesso!");
    window.location.href = "index.html";
}

/* ---------- Carrinho: soma itens e mostra um aviso ---------- */
function atualizarContador(total) {
    document.querySelectorAll('.contador-carrinho').forEach(function (el) {
        el.textContent = total;
        el.classList.remove('pulo');
        void el.offsetWidth; // reinicia a animação
        el.classList.add('pulo');
    });
}

function adicionarAoCarrinho(nomeProduto) {
    var total = parseInt(ler('itensCarrinho') || '0', 10) + 1;
    salvar('itensCarrinho', total);
    atualizarContador(total);

    var aviso = document.getElementById('avisoCarrinho');
    if (aviso && window.bootstrap) {
        document.getElementById('textoAviso').textContent = nomeProduto + ' foi adicionado ao carrinho!';
        bootstrap.Toast.getOrCreateInstance(aviso, { delay: 2500 }).show();
    }
}

/* ---------- Contador regressivo da oferta em destaque (até meia-noite) ---------- */
function iniciarContador() {
    var horas = document.getElementById('cont-horas');
    if (!horas) return; // só existe na index
    var minutos = document.getElementById('cont-min');
    var segundos = document.getElementById('cont-seg');

    function doisDigitos(n) { return n < 10 ? '0' + n : String(n); }

    function atualizar() {
        var agora = new Date();
        var fim = new Date(agora);
        fim.setHours(24, 0, 0, 0);
        var resto = Math.floor((fim - agora) / 1000);
        horas.textContent = doisDigitos(Math.floor(resto / 3600));
        minutos.textContent = doisDigitos(Math.floor((resto % 3600) / 60));
        segundos.textContent = doisDigitos(resto % 60);
    }
    atualizar();
    setInterval(atualizar, 1000);
}

/* ---------- Quando a página termina de carregar ---------- */
document.addEventListener('DOMContentLoaded', function () {
    // ano atual no rodapé
    document.querySelectorAll('#ano').forEach(function (el) { el.textContent = new Date().getFullYear(); });

    // mostra a quantidade guardada no carrinho
    atualizarContador(ler('itensCarrinho') || 0);

    // botões "Comprar"
    document.querySelectorAll('.btn-comprar').forEach(function (botao) {
        botao.addEventListener('click', function () {
            adicionarAoCarrinho(botao.dataset.produto);
        });
    });

    iniciarContador();

    // se o usuário fez login, troca o botão "Login" por "Olá, usuário"
    var usuario = ler('usuarioLogado');
    var botaoLogin = document.querySelector('.navbar a[href="login.html"]');
    if (usuario && botaoLogin && !document.body.classList.contains('pagina-login')) {
        botaoLogin.innerHTML = '<i class="bi bi-person-check"></i> Olá, ' + usuario + ' (sair)';
        botaoLogin.addEventListener('click', function (e) {
            e.preventDefault();
            salvar('usuarioLogado', '');
            location.reload();
        });
    }

    // busca: mostra uma mensagem simples
    var formBusca = document.getElementById('form-busca');
    if (formBusca) {
        formBusca.addEventListener('submit', function (e) {
            e.preventDefault();
            var termo = document.getElementById('campo-busca').value.trim();
            if (termo === '') {
                alert('Digite o nome de um produto para buscar.');
            } else {
                alert('Buscando por "' + termo + '"... A página de resultados será criada na próxima etapa do projeto.');
            }
        });
    }

    // newsletter: valida o e-mail
    var formNews = document.getElementById('form-newsletter');
    if (formNews) {
        formNews.addEventListener('submit', function (e) {
            e.preventDefault();
            var campo = document.getElementById('email-newsletter');
            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campo.value.trim())) {
                alert('Pronto! Você vai receber nossas ofertas em ' + campo.value.trim() + '.');
                campo.value = '';
                campo.classList.remove('is-invalid');
            } else {
                campo.classList.add('is-invalid');
                alert('Digite um e-mail válido.');
            }
        });
    }
});
