/* =========================================================
   Checkpoint Games - jquery-script.js (efeitos com jQuery)
   ========================================================= */
$(document).ready(function () {

    /* ---------- Cadastro: mostra o formulário e esconde o login ---------- */
    $("#botao-cadastrar").click(function () {
        $("#form-cadastrar").slideToggle("slow");
        $("#section-login").slideToggle("slow");
        $("#botao-cadastrar").hide();
    });

    /* Volta do cadastro para o login */
    $("#voltar-login").click(function () {
        $("#form-cadastrar").slideToggle("slow");
        $("#section-login").slideToggle("slow");
        $("#botao-cadastrar").show();
    });

    /* ---------- Botão "Voltar ao topo" aparece só depois de rolar a página ---------- */
    $(window).scroll(function () {
        if ($(this).scrollTop() > 400) {
            $("#voltar-topo").fadeIn();
        } else {
            $("#voltar-topo").fadeOut();
        }
    });

    /* ---------- Mostrar / esconder senha ---------- */
    $(".ver-senha").click(function () {
        var campo = $("#" + $(this).data("alvo"));
        var visivel = campo.attr("type") === "text";
        campo.attr("type", visivel ? "password" : "text");
        $(this).find("i").toggleClass("bi-eye bi-eye-slash");
    });

    /* Tira o vermelho do campo quando a pessoa volta a digitar */
    $("input").on("input", function () {
        $(this).removeClass("is-invalid");
    });

    /* Enter no campo de senha também faz login */
    $("#senha").keypress(function (e) {
        if (e.which === 13) { login(); }
    });

    /* ---------- Máscara de telefone: (00) 00000-0000 ---------- */
    $("#telefone").on("input", function () {
        var n = $(this).val().replace(/\D/g, "").substring(0, 11);
        if (n.length > 6) {
            n = "(" + n.substring(0, 2) + ") " + n.substring(2, n.length - 4) + "-" + n.substring(n.length - 4);
        } else if (n.length > 2) {
            n = "(" + n.substring(0, 2) + ") " + n.substring(2);
        }
        $(this).val(n);
    });

    /* ---------- Esqueci minha senha ---------- */
    $("#esqueci-senha").click(function (e) {
        e.preventDefault();
        alert("Enviamos as instruções para o e-mail cadastrado. Em caso de dúvida, ligue (75) 3000-0000.");
    });

    /* ---------- Filtro de jogos por plataforma ---------- */
    $(".btn-filtro").click(function () {
        var filtro = $(this).data("filtro");
        $(".btn-filtro").removeClass("ativo");
        $(this).addClass("ativo");

        $(".jogo").each(function () {
            var plataformas = $(this).data("plataforma");
            if (filtro === "todos" || plataformas.indexOf(filtro) !== -1) {
                $(this).fadeIn(300);
            } else {
                $(this).fadeOut(300);
            }
        });
    });

    /* ---------- Galeria: abre a foto ampliada numa janela (modal) ---------- */
    $(".foto-galeria").click(function () {
        $("#imagemModal").attr("src", $(this).attr("src")).attr("alt", $(this).attr("alt"));
        $("#tituloModal").text($(this).attr("alt"));
        bootstrap.Modal.getOrCreateInstance(document.getElementById("modalGaleria")).show();
    });

    /* ---------- Rolagem suave nos links do menu ---------- */
    $('a[href^="#section"], a[href="#contato"]').click(function (e) {
        var alvo = $($(this).attr("href"));
        if (alvo.length) {
            e.preventDefault();
            $("html, body").animate({ scrollTop: alvo.offset().top - 10 }, 600);
            var menu = document.getElementById("navbarSupportedContent");
            if (menu && menu.classList.contains("show")) { bootstrap.Collapse.getOrCreateInstance(menu).hide(); }
        }
    });
});
