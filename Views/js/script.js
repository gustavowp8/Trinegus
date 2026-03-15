document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("formManutencao");
  const cepInput = document.getElementById("cep");
  const cidadeInput = document.getElementById("cidade");
  const ufSelect = document.getElementById("uf");

  // =========================
  // 🔎 BUSCA CEP AUTOMÁTICA
  // =========================
  cepInput.addEventListener("blur", async function () {
    const cep = cepInput.value.replace(/\D/g, "");

    if (cep.length !== 8) return;

    try {
      const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await resp.json();

      if (!data.erro) {
        cidadeInput.value = data.localidade;
        ufSelect.value = data.uf;
      }
    } catch (err) {
      console.error("Erro ao buscar CEP:", err);
    }
  });

  // =========================
  // 📩 ENVIO TELEGRAM
  // =========================
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const btn = document.getElementById("btnEnviar");
    const status = document.getElementById("status");

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const cep = cepInput.value.trim();
    const cidade = cidadeInput.value.trim();
    const uf = ufSelect.value;
    const endereco = document.getElementById("endereco").value.trim();
    const qtd = document.getElementById("quantidade").value.trim();

    const token = "8259378498:AAF1rXYr1TQngistGhS4nKBHCk_27IhYgF8";
    const chat_id = "-1003857825945";

    const mensagem =
      `🚀 Nova Solicitação de Manutenção de ar condicionado\n\n` +
      `👤 Cliente: ${nome}\n` +
      `📧 E-mail: ${email}\n` +
      `📞 Telefone: ${telefone}\n` +
      `📍 Endereço: ${endereco}\n` +
      `🏙️ Cidade: ${cidade} - ${uf}\n` +
      `📮 CEP: ${cep}\n` +
      `❄️ Aparelhos: ${qtd}`;

    btn.disabled = true;
    btn.innerText = "Enviando...";
    status.innerHTML = "";

    try {
      await sendTelegramGET(token, chat_id, mensagem);

      form.innerHTML = `
        <div style="text-align: center; padding: 20px;">
          <div style="font-size: 50px; color: #28a745; margin-bottom: 20px;">✅</div>
          <h3>Solicitação enviada, ${nome.split(" ")[0]}!</h3>
          <p>Em breve entraremos em contato pelo WhatsApp.</p>
        </div>
      `;
    } catch (err) {
      status.innerHTML =
        "<span style='color: red;'>Erro ao enviar. Tente novamente.</span>";
      btn.disabled = false;
      btn.innerText = "Enviar Solicitação";
    }
  });

  // =========================
  // 🚀 ENVIO VIA GET (SEM CORS)
  // =========================
  function sendTelegramGET(token, chat_id, text) {
    const url =
      `https://api.telegram.org/bot${token}/sendMessage` +
      `?chat_id=${encodeURIComponent(chat_id)}` +
      `&text=${encodeURIComponent(text)}`;

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(true);
      img.src = url;
      setTimeout(() => resolve(true), 1000);
    });
  }

});

/*Solicita instalação*/

document.addEventListener("DOMContentLoaded", () => {
    const formInstalacao = document.getElementById("formInstalacao");
    const cepInput = document.getElementById("cep");
    const cidadeInput = document.getElementById("cidade");
    const ufSelect = document.getElementById("uf");

    // ==========================================
    // 1. BUSCA CEP (Reutilizada para Instalação)
    // ==========================================
    cepInput.addEventListener("blur", async () => {
        const cep = cepInput.value.replace(/\D/g, "");
        if (cep.length !== 8) return;

        try {
            const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await resp.json();
            if (!data.erro) {
                cidadeInput.value = data.localidade;
                ufSelect.value = data.uf;
            }
        } catch (err) {
            console.error("Erro na busca do CEP:", err);
        }
    });

    // ==========================================
    // 2. ENVIO ESPECÍFICO PARA INSTALAÇÃO
    // ==========================================
    formInstalacao.addEventListener("submit", async (e) => {
        e.preventDefault();

        const btn = document.getElementById("btnEnviar");
        const status = document.getElementById("status");

        // Coleta de dados
        const dados = {
            nome: document.getElementById("nome").value.trim(),
            email: document.getElementById("email").value.trim(),
            telefone: document.getElementById("telefone").value.trim(),
            endereco: document.getElementById("endereco").value.trim(),
            cidade: cidadeInput.value,
            uf: ufSelect.value,
            cep: cepInput.value,
            qtd: document.getElementById("quantidade").value
        };

        const token = "8259378498:AAF1rXYr1TQngistGhS4nKBHCk_27IhYgF8";
        const chat_id = "-1003857825945";

        // Montagem da mensagem com cabeçalho diferente
        const mensagem = 
            `🛠️ *NOVA SOLICITAÇÃO: INSTALAÇÃO* 🛠️\n\n` +
            `👤 *Cliente:* ${dados.nome}\n` +
            `📞 *WhatsApp:* ${dados.telefone}\n` +
            `📧 *E-mail:* ${dados.email}\n` +
            `📍 *Endereço:* ${dados.endereco}\n` +
            `🏙️ *Cidade:* ${dados.cidade} - ${dados.uf}\n` +
            `❄️ *Qtd Aparelhos:* ${dados.qtd}\n` +
            `--------------------------`;

        btn.disabled = true;
        btn.innerText = "Enviando Pedido...";

        try {
            // Chamada da função de envio
            await enviarParaTelegram(token, chat_id, mensagem);

            // Feedback de sucesso
            formInstalacao.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 50px; color: #0056b3; margin-bottom: 20px;">🏗️</div>
                    <h3 style="color: #333;">Solicitação de Instalação Enviada!</h3>
                    <p>Recebemos seu pedido, <b>${dados.nome.split(' ')[0]}</b>. Nossa equipe técnica entrará em contato em breve.</p>
                </div>
            `;
        } catch (err) {
            status.innerHTML = "<span style='color: red;'>Erro ao enviar. Verifique sua conexão.</span>";
            btn.disabled = false;
            btn.innerText = "Tentar Novamente";
        }
    });

    /**
     * Função auxiliar de envio via GET (evita problemas de CORS)
     */
    function enviarParaTelegram(token, chat_id, text) {
        const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${encodeURIComponent(text)}&parse_mode=Markdown`;
        
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(true);
            img.src = url;
            // Timeout de segurança
            setTimeout(() => resolve(true), 1500);
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const formChuveiro = document.getElementById("formChuveiro");
    const cepInput = document.getElementById("cep");
    const cidadeInput = document.getElementById("cidade");
    const ufSelect = document.getElementById("uf");

    // BUSCA CEP
    cepInput.addEventListener("blur", async () => {
        const cep = cepInput.value.replace(/\D/g, "");
        if (cep.length !== 8) return;
        try {
            const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await resp.json();
            if (!data.erro) {
                cidadeInput.value = data.localidade;
                ufSelect.value = data.uf;
            }
        } catch (err) { console.error("Erro CEP:", err); }
    });

    // ENVIO TELEGRAM
    formChuveiro.addEventListener("submit", async (e) => {
        e.preventDefault();

        const btn = document.getElementById("btnEnviar");
        const status = document.getElementById("status");

        const nome = document.getElementById("nome").value.trim();
        const telefone = document.getElementById("telefone").value.trim();
        const endereco = document.getElementById("endereco").value.trim();
        const dataVisita = document.getElementById("dataVisita").value;
        const cidade = cidadeInput.value;
        const uf = ufSelect.value;

        // Formatação da data para PT-BR no Telegram
        const dataFormatada = dataVisita.split('-').reverse().join('/');

        const token = "8259378498:AAF1rXYr1TQngistGhS4nKBHCk_27IhYgF8";
        const chat_id = "-1003857825945";

        const mensagem = 
            `🚿 *NOVA TROCA DE CHUVEIRO* 🚿\n\n` +
            `👤 *Cliente:* ${nome}\n` +
            `📞 *WhatsApp:* ${telefone}\n` +
            `📍 *Endereço:* ${endereco}\n` +
            `🏙️ *Cidade:* ${cidade} - ${uf}\n` +
            `📅 *Data Pretendida:* ${dataFormatada}\n` +
            `💰 *Valor Base:* R$ 170,00`;

        btn.disabled = true;
        btn.innerText = "Agendando...";

        try {
            await sendTelegramGET(token, chat_id, mensagem);

            // Resposta personalizada conforme solicitado
            formChuveiro.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 50px; color: #28a745; margin-bottom: 20px;">📅</div>
                    <h3>Solicitação recebida, ${nome.split(" ")[0]}!</h3>
                    <p>Em breve vamos entrar em contato para <b>confirmar o agendamento</b> da sua visita.</p>
                </div>
            `;
        } catch (err) {
            status.innerHTML = "<span style='color: red;'>Erro ao agendar. Tente novamente.</span>";
            btn.disabled = false;
            btn.innerText = "Solicitar Agendamento";
        }
    });

    function sendTelegramGET(token, chat_id, text) {
        const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${encodeURIComponent(text)}&parse_mode=Markdown`;
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(true);
            img.src = url;
            setTimeout(() => resolve(true), 1000);
        });
    }
});

/* troca de tomada */
document.addEventListener("DOMContentLoaded", () => {
    const formTomada = document.getElementById("formTomada");
    const cepInput = document.getElementById("cep");
    const cidadeInput = document.getElementById("cidade");
    const ufSelect = document.getElementById("uf");

    // BUSCA CEP
    cepInput.addEventListener("blur", async () => {
        const cep = cepInput.value.replace(/\D/g, "");
        if (cep.length !== 8) return;
        try {
            const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await resp.json();
            if (!data.erro) {
                cidadeInput.value = data.localidade;
                ufSelect.value = data.uf;
            }
        } catch (err) { console.error("Erro CEP:", err); }
    });

    // ENVIO TELEGRAM
    formTomada.addEventListener("submit", async (e) => {
        e.preventDefault();

        const btn = document.getElementById("btnEnviar");
        const status = document.getElementById("status");

        const nome = document.getElementById("nome").value.trim();
        const telefone = document.getElementById("telefone").value.trim();
        const endereco = document.getElementById("endereco").value.trim();
        const qtd = document.getElementById("quantidade").value;
        const dataVisita = document.getElementById("dataVisita").value;
        const cidade = cidadeInput.value;
        const uf = ufSelect.value;

        // Cálculo do valor
        const valorTotal = qtd * 100;
        const dataFormatada = dataVisita.split('-').reverse().join('/');

        const token = "8259378498:AAF1rXYr1TQngistGhS4nKBHCk_27IhYgF8";
        const chat_id = "-1003857825945";

        const mensagem = 
            `🔌 *NOVA TROCA DE TOMADA* 🔌\n\n` +
            `👤 *Cliente:* ${nome}\n` +
            `📞 *WhatsApp:* ${telefone}\n` +
            `📍 *Endereço:* ${endereco}\n` +
            `🏙️ *Cidade:* ${cidade} - ${uf}\n` +
            `🔢 *Quantidade:* ${qtd} unidade(s)\n` +
            `📅 *Data Pretendida:* ${dataFormatada}\n` +
            `💰 *Valor Estimado:* R$ ${valorTotal},00`;

        btn.disabled = true;
        btn.innerText = "Agendando...";

        try {
            await sendTelegramGET(token, chat_id, mensagem);

            formTomada.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 50px; color: #ffa500; margin-bottom: 20px;">🔌</div>
                    <h3>Solicitação enviada com sucesso!</h3>
                    <p>Em breve vamos entrar em contato para <b>confirmar o agendamento</b> da troca de suas ${qtd} tomadas.</p>
                </div>
            `;
        } catch (err) {
            status.innerHTML = "<span style='color: red;'>Erro ao agendar. Tente novamente.</span>";
            btn.disabled = false;
            btn.innerText = "Solicitar Agendamento";
        }
    });

    function sendTelegramGET(token, chat_id, text) {
        const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${encodeURIComponent(text)}&parse_mode=Markdown`;
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(true);
            img.src = url;
            setTimeout(() => resolve(true), 1000);
        });
    }
});

/* Automação TI */

document.addEventListener("DOMContentLoaded", () => {
    const formPC = document.getElementById("formPC");
    const checks = document.querySelectorAll(".servico-check");
    const displayTotal = document.getElementById("valorTotal");

    // ==========================================
    // SOMA EM TEMPO REAL
    // ==========================================
    checks.forEach(check => {
        check.addEventListener("change", () => {
            let total = 0;
            checks.forEach(c => {
                if (c.checked) total += parseInt(c.getAttribute("data-preco"));
            });
            displayTotal.innerText = total;
        });
    });

    // ==========================================
    // ENVIO TELEGRAM
    // ==========================================
    formPC.addEventListener("submit", async (e) => {
        e.preventDefault();

        const btn = document.getElementById("btnEnviar");
        const status = document.getElementById("status");

        // Capturar serviços selecionados
        let servicosSelecionados = [];
        let totalFinal = 0;
        
        checks.forEach(c => {
            if (c.checked) {
                servicosSelecionados.push(c.value);
                totalFinal += parseInt(c.getAttribute("data-preco"));
            }
        });

        if (servicosSelecionados.length === 0) {
            alert("Por favor, selecione ao menos um serviço.");
            return;
        }

        const nome = document.getElementById("nome").value.trim();
        const telefone = document.getElementById("telefone").value.trim();
        const endereco = document.getElementById("endereco").value.trim();

        const token = "8259378498:AAF1rXYr1TQngistGhS4nKBHCk_27IhYgF8";
        const chat_id = "-1003857825945";

        const mensagem = 
            `💻 *NOVA MANUTENÇÃO DE COMPUTADOR* 💻\n\n` +
            `👤 *Cliente:* ${nome}\n` +
            `📞 *WhatsApp:* ${telefone}\n` +
            `📍 *Local:* ${endereco}\n\n` +
            `🛠️ *Serviços:* \n- ${servicosSelecionados.join('\n- ')}\n\n` +
            `💰 *VALOR TOTAL: R$ ${totalFinal},00*`;

        btn.disabled = true;
        btn.innerText = "Enviando Solicitação...";

        try {
            await sendTelegramGET(token, chat_id, mensagem);

            formPC.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 50px; color: #0056b3; margin-bottom: 20px;">👨‍💻</div>
                    <h3>Solicitação de TI Enviada!</h3>
                    <p>Obrigado, ${nome.split(" ")[0]}. Em breve entraremos em contato para combinar a retirada ou visita.</p>
                </div>
            `;
        } catch (err) {
            status.innerHTML = "<span style='color: red;'>Erro ao enviar.</span>";
            btn.disabled = false;
        }
    });

    function sendTelegramGET(token, chat_id, text) {
        const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${encodeURIComponent(text)}&parse_mode=Markdown`;
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(true);
            img.src = url;
            setTimeout(() => resolve(true), 1200);
        });
    }
});

/* Outros */

document.addEventListener("DOMContentLoaded", () => {

const form = document.getElementById("formOutros");
const cepInput = document.getElementById("cep");
const cidadeInput = document.getElementById("cidade");
const ufSelect = document.getElementById("uf");
const servicoSelect = document.getElementById("servico");
const descricaoInput = document.getElementById("descricao");
const telefoneInput = document.getElementById("telefone");


// =========================
// AUTO COMPLETAR DESCRIÇÃO
// =========================

servicoSelect.addEventListener("change", () => {

    if(servicoSelect.value !== "" && descricaoInput.value === ""){
        descricaoInput.value = servicoSelect.value;
    }

});


// =========================
// MASCARA CEP
// =========================

cepInput.addEventListener("input", () => {

    cepInput.value = cepInput.value
    .replace(/\D/g,"")
    .replace(/(\d{5})(\d)/,"$1-$2")
    .slice(0,9);

});


// =========================
// MASCARA TELEFONE
// =========================

telefoneInput.addEventListener("input", () => {

    telefoneInput.value = telefoneInput.value
    .replace(/\D/g,"")
    .replace(/^(\d{2})(\d)/g,"($1) $2")
    .replace(/(\d{5})(\d)/,"$1-$2")
    .slice(0,15);

});


// =========================
// BUSCAR CEP
// =========================

cepInput.addEventListener("blur", async () => {

const cep = cepInput.value.replace(/\D/g,"");

if(cep.length !== 8) return;

cidadeInput.value = "Buscando...";

try{

const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
const data = await resp.json();

if(!data.erro){

cidadeInput.value = data.localidade;
ufSelect.value = data.uf;

}else{

cidadeInput.value = "";
alert("CEP não encontrado.");

}

}catch(err){

console.error("Erro ao buscar CEP:",err);
cidadeInput.value = "";

}

});


// =========================
// ENVIO TELEGRAM
// =========================

form.addEventListener("submit", async (e) => {

e.preventDefault();

const btn = document.getElementById("btnEnviar");
const status = document.getElementById("status");

const nome = document.getElementById("nome").value.trim();
const email = document.getElementById("email").value.trim();
const telefone = telefoneInput.value.trim();
const cep = cepInput.value.trim();
const cidade = cidadeInput.value.trim();
const uf = ufSelect.value;
const endereco = document.getElementById("endereco").value.trim();
const descricao = descricaoInput.value.trim();
const servico = servicoSelect.value;

const token = "8259378498:AAF1rXYr1TQngistGhS4nKBHCk_27IhYgF8";
const chat_id = "-1003857825945";

const mensagem =
`🛠 *SOLICITAÇÃO DE SERVIÇO*\n\n` +
`👤 *Cliente:* ${nome}\n` +
`📧 *E-mail:* ${email}\n` +
`📞 *WhatsApp:* ${telefone}\n\n` +
`📍 *Endereço:* ${endereco}\n` +
`🏙️ *Cidade:* ${cidade} - ${uf}\n` +
`📮 *CEP:* ${cep}\n\n` +
`🔧 *Serviço selecionado:* ${servico || "Não selecionado"}\n\n` +
`📋 *Descrição:* \n${descricao}`;


btn.disabled = true;
btn.innerText = "Enviando...";

try{

await sendTelegramGET(token, chat_id, mensagem);

form.innerHTML = `
<div style="text-align:center;padding:30px;">
<div style="font-size:60px;margin-bottom:10px;">✅</div>
<h3>Solicitação enviada!</h3>
<p>Olá ${nome.split(" ")[0]}, recebemos seu pedido.</p>
<p>Em breve nossa equipe entrará em contato.</p>
</div>
`;

}catch{

status.innerHTML = "<span style='color:red'>Erro ao enviar. Tente novamente.</span>";

btn.disabled = false;
btn.innerText = "Enviar Solicitação";

}

});


// =========================
// FUNÇÃO TELEGRAM
// =========================

function sendTelegramGET(token, chat_id, text){

const url =
`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${encodeURIComponent(text)}&parse_mode=Markdown`;

return new Promise((resolve) => {

const img = new Image();

img.onload = () => resolve(true);
img.onerror = () => resolve(true);

img.src = url;

setTimeout(() => resolve(true),1200);

});

}

});
