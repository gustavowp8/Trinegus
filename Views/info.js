const btnMobile = document.getElementById('btn-mobile');

function toggleMenu(){
    const nav = document.getElementById('nav');
    nav.classList.toggle('active');
}

btnMobile.addEventListener('click', toggleMenu);

// Configurações do Telegram - PREENCHA AQUI
const TELEGRAM_TOKEN = 'SEU_TOKEN_AQUI'; 
const TELEGRAM_CHAT_ID = 'SEU_CHAT_ID_AQUI';

const modal = document.getElementById("modalServico");
const btnAbrir = document.getElementById("openModal");
const spanFechar = document.getElementsByClassName("close")[0];
const form = document.getElementById("formTelegram");
const statusMsg = document.getElementById("statusMensagem");

// Abrir e fechar modal
btnAbrir.onclick = () => modal.style.display = "block";
spanFechar.onclick = () => modal.style.display = "none";
window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; }

// Enviar para Telegram
form.onsubmit = async (e) => {
    e.preventDefault();
    const btnTextoOriginal = document.getElementById("btnEnviar").innerText;
    document.getElementById("btnEnviar").innerText = "Enviando...";
    document.getElementById("btnEnviar").disabled = true;

    const dados = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        whatsapp: document.getElementById("whatsapp").value,
        servico: document.getElementById("servico").value,
        descricao: document.getElementById("descricao").value || "Não informada"
    };

    const mensagem = `🚀 **Nova Solicitação Trinegus informatica**\n\n` +
                     `👤 **Nome:** ${dados.nome}\n` +
                     `📧 **E-mail:** ${dados.email}\n` +
                     `📱 **WhatsApp:** ${dados.whatsapp}\n` +
                     `🛠️ **Serviço:** ${dados.servico}\n` +
                     `📝 **Descrição:** ${dados.descricao}`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${"8259378498:AAF1rXYr1TQngistGhS4nKBHCk_27IhYgF8"}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: -1003857825945,
                text: mensagem,
                parse_mode: 'Markdown'
            })
        });

        if (response.ok) {
            statusMsg.innerHTML = `<p class="sucesso">✅ Solicitação enviada com sucesso! Entraremos em contato em breve.</p>`;
            form.reset();
            setTimeout(() => { modal.style.display = "none"; statusMsg.innerHTML = ""; }, 4000);
        } else {
            throw new Error();
        }
    } catch (error) {
        statusMsg.innerHTML = `<p class="erro">❌ Erro ao enviar. Por favor, entre em contato pelo WhatsApp: **61 3575-2752**</p>`;
    } finally {
        document.getElementById("btnEnviar").innerText = btnTextoOriginal;
        document.getElementById("btnEnviar").disabled = false;
    }
};