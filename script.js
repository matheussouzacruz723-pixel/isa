const STORAGE_KEY = 'psicologia_social_v3';

function getStoredData() { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
function saveData(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

let isReviewMode = false;

function toggleReviewMode() {
  isReviewMode = !isReviewMode;
  document.body.classList.toggle('review-mode-active', isReviewMode);
  document.getElementById('btn-revisao').classList.toggle('active', isReviewMode);
  const data = getStoredData();
  data.reviewMode = isReviewMode;
  saveData(data);
}

function initReviewMode() {
  const data = getStoredData();
  if (data.reviewMode) {
    isReviewMode = true;
    document.body.classList.add('review-mode-active');
    document.getElementById('btn-revisao').classList.add('active');
  }
}

function toggleAccordion(header) {
  header.classList.toggle('active');
  header.nextElementSibling.classList.toggle('open');
  const data = getStoredData();
  if (!data.accordions) data.accordions = {};
  const id = header.querySelector('h4').textContent;
  data.accordions[id] = header.classList.contains('active');
  saveData(data);
}

function flipCard(card) {
  const meta = card.querySelector('.flashcard-meta');
  const content = card.querySelector('.flashcard-content');
  const isFlipped = meta.textContent === 'Resposta';
  meta.textContent = isFlipped ? 'Pergunta' : 'Resposta';
  content.textContent = isFlipped ? card.dataset.front : card.dataset.back;
  const data = getStoredData();
  if (!data.flashcards) data.flashcards = {};
  data.flashcards[card.dataset.front] = !isFlipped;
  saveData(data);
}

function selectQuizOption(btn) {
  const options = btn.closest('.quiz-options');
  const correct = parseInt(options.dataset.answer);
  const explanation = options.dataset.explanation;
  const selected = Array.from(options.querySelectorAll('.quiz-option')).indexOf(btn);
  const result = options.nextElementSibling;
  options.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
  btn.classList.add('selected');
  const isCorrect = selected === correct;
  result.className = 'quiz-result ' + (isCorrect ? 'correct' : 'incorrect');
  result.innerHTML = '<strong>' + (isCorrect ? 'Resposta correta!' : 'Resposta errada.') + '</strong><br>' + explanation;
  const data = getStoredData();
  if (!data.quizAnswers) data.quizAnswers = {};
  data.quizAnswers[explanation] = { selected, correct: isCorrect };
  saveData(data);
}

// ========== BANCO DE QUESTÕES POR DIFICULDADE ==========
const questionBank = {
  easy: [
    { question: "Segundo Durkheim, as representações coletivas são:", options: ["impulsos biológicos", "formas de pensamento criadas socialmente", "emoções individuais", "crenças privadas"], answer: 1, explanation: "Durkheim entende o pensamento coletivo como produto da sociedade." },
    { question: "Na teoria de Moscovici, representações sociais ajudam as pessoas a:", options: ["eliminar cultura", "compreender e comunicar a realidade", "rejeitar sociedade", "substituir ciência"], answer: 1, explanation: "As representações sociais permitem compreender e comunicar a realidade." },
    { question: "O que é consciência coletiva?", options: ["Consciência individual", "Crenças e sentimentos partilhados", "Inconsciente pessoal", "Pensamento racional"], answer: 1, explanation: "A consciência coletiva é o conjunto de crenças e sentimentos partilhados por um grupo social." },
    { question: "O que é objetivação em Moscovici?", options: ["Esconder ideias", "Transformar o abstrato em concreto", "Classificar informações", "Destruir conceitos"], answer: 1, explanation: "Objetivação é transformar algo abstrato em algo concreto e imaginável." },
    { question: "O que é ancoragem?", options: ["Ligar ideia nova ao conhecido", "Ignorar novas ideias", "Criar confusão", "Esquecer"], answer: 0, explanation: "Ancoragem é ligar uma ideia nova a categorias e conhecimentos já conhecidos." }
  ],
  medium: [
    { question: "O que diferencia Moscovici de Durkheim?", options: ["Moscovici analisa construção cotidiana do conhecimento", "Moscovici ignora sociedade", "Durkheim explica biologia", "Durkheim rejeita representações"], answer: 0, explanation: "Moscovici analisa a construção cotidiana do conhecimento, enquanto Durkheim foca nas estruturas sociais." },
    { question: "Na teoria de Moscovici, ancoragem significa:", options: ["rejeitar ideias novas", "interpretar novas ideias com base em conhecimentos conhecidos", "negar cultura", "eliminar crenças"], answer: 1, explanation: "Ancoragem é interpretar novas ideias com base em conhecimentos já conhecidos." },
    { question: "Freud explica a coesão dos grupos porque:", options: ["indivíduos compartilham identificação com um líder", "todos pensam igual", "não existe hierarquia", "grupos eliminam emoções"], answer: 0, explanation: "Grupos se organizam porque os indivíduos compartilham identificação com um líder." },
    { question: "Uma crítica às teorias de Le Bon e McDougall é que elas:", options: ["simplificam o comportamento coletivo", "ignoram emoções", "negam liderança", "enfatizam cultura"], answer: 0, explanation: "Uma crítica comum é que essas teorias simplificam o comportamento coletivo." },
    { question: "O que é a anomia em Durkheim?", options: ["Ordem social completa", "Estado de desregulação social", "Tipo de solidariedade", "Forma de coesão"], answer: 1, explanation: "Anomia é o estado de desregulação social onde normas perdem força." }
  ],
  hard: [
    { question: "Uma comparação adequada entre Durkheim e Moscovici indica que:", options: ["ambos negam a influência social", "ambos estudam conhecimento social em níveis diferentes", "Durkheim estuda biologia", "Moscovici rejeita coletividade"], answer: 1, explanation: "Ambos estudam conhecimento social, mas em níveis diferentes: Durkheim nas estruturas coletivas, Moscovici na construção cotidiana." },
    { question: "A psicologia social crítica se diferencia das clássicas por:", options: ["negar qualquer influência social", "ignorar o indivíduo", "focar em desigualdade e transformação social", "rejeitar método científico"], answer: 2, explanation: "A psicologia social crítica foca em desigualdade e transformação social." },
    { question: "Le Bon e McDougall compartilham a ideia de que:", options: ["multidões são sempre racionais", "comportamento grupal é determinado por fatores biológicos", "existe contágio emocional nas massas", "grupos eliminam individualidade"], answer: 2, explanation: "Ambos reconhecem o fenômeno do contágio emocional nas massas." },
    { question: "Moscovici avança em relação a Durkheim ao:", options: ["negar representações coletivas", "adicionar a perspectiva do sujeito na construção do conhecimento", "eliminar a dimensão social", "focar apenas em estruturas"], answer: 1, explanation: "Moscovici adiciona a perspectiva do sujeito na construção cotidiana do conhecimento." },
    { question: "O conceito de ideal do ego em Freud está relacionado a:", options: ["inconsciente coletivo", "identificação com figura de referência", "racionalidade pura", "memória individual"], answer: 1, explanation: "Ideal do ego é a imagem de referência com a qual o indivíduo se identifica." }
  ]
};

// Questões originais do modo prova (todas as dificuldades)
const examQuestions = [
  { question: "Qual conceito aparece como central em Durkheim?", options: ["Representações coletivas", "Inconsciente coletivo", "Condicionamento clássico", "Dissonância cognitiva"], answer: 0, explanation: "Durkheim trabalha com a ideia de representações coletivas.", difficulty: "easy" },
  { question: "As representações coletivas em Lévy-Bruhl...", options: ["São apenas ideias individuais", "São heranças sociais", "Desaparecem quando cresce", "Valem apenas para antigas"], answer: 1, explanation: "As representações coletivas aparecem como heranças sociais.", difficulty: "easy" },
  { question: "O foco de Moscovici está em...", options: ["Negar senso comum", "Comportamentos biológicos", "Sujeito e sociedade constroem", "Estudar traumas"], answer: 2, explanation: "Moscovici quer entender como o conhecimento é construído.", difficulty: "medium" },
  { question: "Uma massa se organiza porque...", options: ["Rejeita liderança", "Se identifica com líder", "Elimina afeto", "Aumenta autonomia"], answer: 1, explanation: "O líder vira referência central com identificação.", difficulty: "easy" },
  { question: "Le Bon associa a multidão a...", options: ["Violência e irracionalidade", "Autonomia reflexiva", "Planejamento estável", "Neutralidade"], answer: 0, explanation: "Le Bon descreve a multidão como violenta e irracional.", difficulty: "easy" },
  { question: "Psicologia social crítica enfatiza...", options: ["Opressão e transformação", "Biologia", "Diferenças individuais", "Psicanálise"], answer: 0, explanation: "A psicologia social crítica aparece ligada à América Latina e à opressão.", difficulty: "medium" },
  { question: "O que é a consciência coletiva?", options: ["Consciência individual", "Crenças e sentimentos partilhados", "Inconsciente pessoal", "Pensamento racional"], answer: 1, explanation: "A consciência coletiva é o conjunto de crenças e sentimentos partilhados por um grupo social.", difficulty: "easy" },
  { question: "O que é objetivação em Moscovici?", options: ["Esconder ideias", "Transformar o abstrato em concreto", "Classificar informações", "Destruir conceitos"], answer: 1, explanation: "Objetivação é transformar algo abstrato em algo concreto e imaginável.", difficulty: "easy" },
  { question: "O que é ancoragem?", options: ["Ligar ideia nova ao conhecido", "Ignorar novas ideias", "Criar confusão", "Esquecer"], answer: 0, explanation: "Ancoragem é ligar uma ideia nova a categorias e conhecimentos já conhecidos.", difficulty: "easy" },
  { question: "Freud diz que a massa funciona principalmente por:", options: ["Somente razão", "Apenas lógica", "Vínculo afetivo", "Negação"], answer: 2, explanation: "A massa funciona por vínculo afetivo, não só pela razão.", difficulty: "medium" },
  { question: "O que é ideal do ego?", options: ["Imagem de referência", "Inconsciente coletivo", "Only reason", "Personalidade"], answer: 0, explanation: "É a imagem de referência que o indivíduo toma como modelo.", difficulty: "easy" },
  { question: "O que é anomia?", options: ["Ordem social", "Estado de desregulação social", "Solidariedade", "Coercão"], answer: 1, explanation: "Anomia é o estado de desregulação social onde normas perdem força.", difficulty: "medium" },
  { question: "Le Bon descreve a multidão com qual característica?", options: ["Racionalidade", "Violência e irracionalidade", "Neutralidade", "Ordenamento"], answer: 1, explanation: "Le Bon caracteriza multidões pela violência, irracionalidade, sugestionabilidade e contágio.", difficulty: "easy" },
  { question: "O que é contágio segundo Le Bon?", options: ["Doença física", "Espalhamento de emoções no grupo", "Isolamento", "Only reason"], answer: 1, explanation: "Contágio é o espalhamento rápido de emoções e comportamentos no grupo.", difficulty: "easy" },
  { question: "A Psicologia social sociológica foca em:", options: ["Apenas indivíduo", "Grupos e participação social", "Only behavior", "Genética"], answer: 1, explanation: "Foca grupos, participação social e impacto dos fenômenos coletivos.", difficulty: "easy" },
  // Questões de comparação (hard)
  { question: "Qual a diferença entre Durkheim e Moscovici?", options: ["Durkheim enfatiza estruturas coletivas; Moscovici enfatiza construção cotidiana", "São praticamente iguais", "Moscovici nega sociedade", "Durkheim estuda indivíduo"], answer: 0, explanation: "Durkheim enfatiza estruturas coletivas; Moscovici enfatiza construção cotidiana do conhecimento.", difficulty: "hard" },
  { question: "Qual a diferença entre Durkheim e Freud?", options: ["Durkheim analisa estruturas sociais; Freud analisa vínculos psíquicos", "São ambos funcionalistas", "Freud não estuda massas", "Não há diferenças"], answer: 0, explanation: "Durkheim analisa estruturas sociais; Freud analisa vínculos psíquicos e identificação.", difficulty: "hard" },
  { question: "O que aproxima Durkheim e Moscovici?", options: ["Ambos reconhecem a influência social no pensamento", "Ambos negam cultura", "Ambos são biologicistas", "Não há aproximação"], answer: 0, explanation: "Ambos reconhecem a influência social no pensamento.", difficulty: "hard" },
  { question: "O que diferencia psicologia social crítica das abordagens clássicas?", options: ["O foco em desigualdade e transformação social", "O biologicismo", "O individualismo", "A negação de métodos"], answer: 0, explanation: "O foco em desigualdade e transformação social.", difficulty: "hard" }
];

// ========== MODO REVISÃO 5 MINUTOS - DADOS COMPLETOS ==========
const quickReviewData = {
  authors: [
    {
      name: "Durkheim",
      icon: "🏛️",
      idea: "A sociedade molda o indivíduo. O pensamento humano não nasce no vazio - a vida coletiva cria formas sociais de pensar e agir.",
      concepts: ["Representações coletivas", "Consciência coletiva", "Fato social", "Anomia"],
      flashcards: [
        { q: "O que são representações coletivas em Durkheim?", a: "Formas de pensamento socialmente produzidas que orientam como os indivíduos interpretam a realidade." },
        { q: "O que é consciência coletiva?", a: "Conjunto de crenças e valores compartilhados por um grupo social." },
        { q: "Como a sociedade influencia o indivíduo em Durkheim?", a: "Por meio de normas, valores e representações coletivas." },
        { q: "O que caracteriza um fato social?", a: "Algo externo ao indivíduo que exerce poder de coerção." }
      ]
    },
    {
      name: "Lévy-Bruhl",
      icon: "📚",
      idea: "O pensamento social é transmitido, repetido e incorporado como herança simbólica.",
      concepts: ["Herança social", "Mentalidade coletiva", "Processamento cognitivo"],
      flashcards: [
        { q: "O que Lévy-Bruhl investigava?", a: "O funcionamento das representações coletivas nas sociedades." },
        { q: "O que significa herança social das representações?", a: "Crenças e hábitos transmitidos culturalmente." },
        { q: "Quais processos cognitivos aparecem na mentalidade coletiva?", a: "Memória, abstração, generalização e classificação." }
      ]
    },
    {
      name: "Moscovici",
      icon: "💬",
      idea: "O sujeito também produz sentido junto com o coletivo. Representações sociais ajudam a compreender e comunicar a realidade.",
      concepts: ["Representação social", "Ancoragem", "Objetivação"],
      flashcards: [
        { q: "O que é uma representação social?", a: "Um sistema compartilhado de significados." },
        { q: "O que é ancoragem?", a: "Interpretar ideias novas com base em ideias conhecidas." },
        { q: "O que é objetivação?", a: "Tornar conceitos abstratos em imagens concretas." }
      ]
    },
    {
      name: "Freud",
      icon: "👥",
      idea: "A massa não funciona só pela razão. Funciona por vínculo afetivo, identificação e desejo de proteção.",
      concepts: ["Identificação com o líder", "Ideal do ego", "Vínculo afetivo"],
      flashcards: [
        { q: "O que Freud analisa na psicologia das massas?", a: "O comportamento dos indivíduos em grupos." },
        { q: "Por que grupos se organizam em torno de líderes?", a: "Porque ocorre identificação com o líder." },
        { q: "O que acontece com o indivíduo na massa?", a: "Ele tende a agir de forma mais emocional." },
        { q: "O que é ideal do ego no contexto de massas?", a: "A figura com a qual os indivíduos se identificam." }
      ]
    },
    {
      name: "Le Bon / McDougall",
      icon: "⚡",
      idea: "Multidões são perigosas, emocionais e irracionais. Comportamento se espalha como vírus.",
      concepts: ["Contágio", "Irracionalidade", "Instintos"],
      flashcards: [
        { q: "Como Le Bon descrevia a multidão?", a: "Violenta, irracional, sugestionável." },
        { q: "O que significa contágio?", a: "Espalhamento rápido de emoções e comportamentos no grupo." },
        { q: "O que McDougall defendia?", a: "Que o comportamento humano poderia ser explicado pelos instintos." }
      ]
    },
    {
      name: "Psicologia Social Contemporânea",
      icon: "🌍",
      idea: "Estuda linguagem, vínculos, opressão, comunicação, mal-estar e transformação social.",
      concepts: ["Psicologia social sociológica", "Psicologia social psicológica", "Psicologia social crítica"],
      flashcards: [
        { q: "O que caracteriza a psicologia social crítica?", a: "Analisa opressão e busca transformação social." },
        { q: "O que caracteriza a psicologia social sociológica?", a: "Foca grupos, participação social e impacto dos fenômenos coletivos." },
        { q: "O que caracteriza a psicologia social psicológica?", a: "Analisa os modos de ser do indivíduo em relação aos outros." }
      ]
    }
  ],
  comparisons: [
    { q: "Qual a diferença entre Durkheim e Moscovici?", a: "Durkheim enfatiza estruturas coletivas; Moscovici enfatiza construção cotidiana do conhecimento." },
    { q: "Qual a diferença entre Durkheim e Freud?", a: "Durkheim analisa estruturas sociais; Freud analisa vínculos psíquicos e identificação." },
    { q: "O que aproxima Durkheim e Moscovici?", a: "Ambos reconhecem a influência social no pensamento." },
    { q: "O que diferencia psicologia social crítica das abordagens clássicas?", a: "O foco em desigualdade e transformação social." },
    { q: "Qual a diferença entre Freud e Le Bon?", a: "Freud foca na identificação afetiva; Le Bon foca na irracionalidade e contágio." }
  ]
};

// Variáveis do modo prova
let currentExamQuestion = 0, examAnswers = [], examCompleted = false;
let currentExamMode = 'normal';
let examQuestionsFiltered = [];

// ========== MODO REVISÃO 5 MINUTOS ==========
let quickReviewState = { authorIndex: 0, cardIndex: 0, showingAnswer: false };

function openQuickReview() {
  document.getElementById('exam-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
  quickReviewState = { authorIndex: 0, cardIndex: 0, showingAnswer: false };
  showQuickReviewContent();
}

function showQuickReviewContent() {
  const content = document.getElementById('exam-content');
  const author = quickReviewData.authors[quickReviewState.authorIndex];
  const card = author.flashcards[quickReviewState.cardIndex];
  const totalCards = author.flashcards.length;
  const totalAuthors = quickReviewData.authors.length;
  
  document.getElementById('exam-progress').textContent = `Revisão 5 Min - ${author.name}`;
  
  let flashcardsHtml = author.flashcards.map((fc, idx) => 
    `<div class="quick-fc-item ${idx === quickReviewState.cardIndex ? 'active' : ''}" onclick="jumpToQuickCard(${idx})">${fc.q.substring(0, 30)}...</div>`
  ).join('');
  
  content.innerHTML = `
    <div class="quick-review-container">
      <div class="quick-author-header">
        <span class="quick-author-icon">${author.icon}</span>
        <span class="quick-author-name">${author.name}</span>
      </div>
      <div class="quick-idea-box">
        <div class="quick-idea-label">Ideia Central</div>
        <div class="quick-idea-text">${author.idea}</div>
      </div>
      <div class="quick-concepts">
        <div class="quick-concepts-label">Conceitos-chave</div>
        <div class="quick-concepts-list">
          ${author.concepts.map(c => `<span class="quick-concept-tag">${c}</span>`).join('')}
        </div>
      </div>
      <div class="quick-flashcard-section">
        <div class="quick-flashcard-header">
          <span>Flashcards Fortes</span>
          <span class="quick-card-counter">${quickReviewState.cardIndex + 1} / ${totalCards}</span>
        </div>
        <div class="quick-flashcard-nav">
          ${author.flashcards.map((fc, idx) => 
            `<button class="quick-fc-btn ${idx === quickReviewState.cardIndex ? 'active' : ''}" onclick="jumpToQuickCard(${idx})">${idx + 1}</button>`
          ).join('')}
        </div>
        <div class="quick-flashcard-display" onclick="toggleQuickAnswer()">
          <div class="quick-fc-question">${card.q}</div>
          <div class="quick-fc-answer ${quickReviewState.showingAnswer ? 'show' : ''}">${card.a}</div>
          <div class="quick-fc-hint">${quickReviewState.showingAnswer ? '✓ Clique para esconder' : '👆 Clique para revelar'}</div>
        </div>
      </div>
      <div class="quick-nav-buttons">
        <button class="quick-nav-btn" onclick="prevQuickCard()" ${quickReviewState.cardIndex === 0 && quickReviewState.authorIndex === 0 ? 'disabled' : ''}>
          ← Anterior
        </button>
        <button class="quick-nav-btn quick-nav-btn-next" onclick="nextQuickCard()">
          ${quickReviewState.cardIndex === totalCards - 1 && quickReviewState.authorIndex === totalAuthors - 1 ? 'Finalizar →' : 'Próxima →'}
        </button>
      </div>
    </div>
  `;
  
  updateQuickReviewButtons();
}

function jumpToQuickCard(cardIndex) {
  quickReviewState.cardIndex = cardIndex;
  quickReviewState.showingAnswer = false;
  showQuickReviewContent();
}

function toggleQuickAnswer() {
  quickReviewState.showingAnswer = !quickReviewState.showingAnswer;
  showQuickReviewContent();
}

function prevQuickCard() {
  if (quickReviewState.cardIndex > 0) {
    quickReviewState.cardIndex--;
  } else if (quickReviewState.authorIndex > 0) {
    quickReviewState.authorIndex--;
    quickReviewState.cardIndex = quickReviewData.authors[quickReviewState.authorIndex].flashcards.length - 1;
  }
  quickReviewState.showingAnswer = false;
  showQuickReviewContent();
}

function nextQuickCard() {
  const totalAuthors = quickReviewData.authors.length;
  const currentAuthor = quickReviewData.authors[quickReviewState.authorIndex];
  
  if (quickReviewState.cardIndex < currentAuthor.flashcards.length - 1) {
    quickReviewState.cardIndex++;
  } else if (quickReviewState.authorIndex < totalAuthors - 1) {
    quickReviewState.authorIndex++;
    quickReviewState.cardIndex = 0;
  } else {
    // Show comparisons
    showQuickReviewComparisons();
    return;
  }
  quickReviewState.showingAnswer = false;
  showQuickReviewContent();
}

function updateQuickReviewButtons() {
  const totalAuthors = quickReviewData.authors.length;
  const currentAuthor = quickReviewData.authors[quickReviewState.authorIndex];
  const totalCards = currentAuthor.flashcards.length;
  const isLast = quickReviewState.cardIndex === totalCards - 1 && quickReviewState.authorIndex === totalAuthors - 1;
  const isFirst = quickReviewState.cardIndex === 0 && quickReviewState.authorIndex === 0;
  
  const btns = document.querySelectorAll('.quick-nav-btn');
  if (btns[0]) btns[0].disabled = isFirst;
  if (btns[1]) btns[1].textContent = isLast ? 'Ver Comparações →' : 'Próxima →';
}

function showQuickReviewComparisons() {
  const content = document.getElementById('exam-content');
  document.getElementById('exam-progress').textContent = 'Comparações Rápidas';
  
  content.innerHTML = `
    <div class="quick-review-container">
      <div class="quick-comparisons-header">
        <span class="quick-author-icon">⚖️</span>
        <span class="quick-author-name">Comparações Rápidas</span>
      </div>
      <div class="quick-comp-list">
        ${quickReviewData.comparisons.map((comp, idx) => `
          <div class="quick-comp-item" onclick="this.classList.toggle('show')">
            <div class="quick-comp-q">${comp.q}</div>
            <div class="quick-comp-a">${comp.a}</div>
          </div>
        `).join('')}
      </div>
      <div class="quick-nav-buttons">
        <button class="quick-nav-btn" onclick="goToLastQuickCard()">← Voltar</button>
        <button class="quick-nav-btn quick-nav-btn-next" onclick="closeExamMode()">Finalizar ✓</button>
      </div>
    </div>
  `;
}

function goToLastQuickCard() {
  quickReviewState.authorIndex = quickReviewData.authors.length - 1;
  quickReviewState.cardIndex = quickReviewData.authors[quickReviewState.authorIndex].flashcards.length - 1;
  quickReviewState.showingAnswer = false;
  showQuickReviewContent();
}

// ========== MODO PROVA COM DIFICULDADE ==========
function openExamMode() {
  document.getElementById('exam-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
  showDifficultySelector();
}

function showDifficultySelector() {
  const content = document.getElementById('exam-content');
  document.getElementById('exam-progress').textContent = 'Escolha a dificuldade';
  document.getElementById('exam-actions').innerHTML = '';
  content.innerHTML = `
    <div class="difficulty-selector">
      <div class="difficulty-title">Selecione o modo de prova:</div>
      <button class="difficulty-btn" onclick="startExam('easy')">
        <span class="difficulty-icon">🌱</span>
        <span class="difficulty-name">Fácil</span>
        <span class="difficulty-desc">5 perguntas básicas</span>
      </button>
      <button class="difficulty-btn" onclick="startExam('medium')">
        <span class="difficulty-icon">🌿</span>
        <span class="difficulty-name">Médio</span>
        <span class="difficulty-desc">5 perguntas intermediárias</span>
      </button>
      <button class="difficulty-btn" onclick="startExam('hard')">
        <span class="difficulty-icon">🔥</span>
        <span class="difficulty-name">Difícil</span>
        <span class="difficulty-desc">5 perguntas avançadas</span>
      </button>
      <button class="difficulty-btn difficulty-btn-final" onclick="startExam('final')">
        <span class="difficulty-icon">🎯</span>
        <span class="difficulty-name">Simulado Final</span>
        <span class="difficulty-desc">20 perguntas misturadas</span>
      </button>
      <button class="difficulty-btn difficulty-btn-normal" onclick="startExam('normal')">
        <span class="difficulty-icon">📝</span>
        <span class="difficulty-name">Prova Normal</span>
        <span class="difficulty-desc">15 perguntas (todas)</span>
      </button>
    </div>
  `;
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function shuffleOptions(question) {
  const correctAnswer = question.options[question.answer];
  const shuffledOptions = shuffleArray(question.options);
  const newAnswer = shuffledOptions.indexOf(correctAnswer);
  return { ...question, options: shuffledOptions, answer: newAnswer };
}

function startExam(mode) {
  currentExamMode = mode;
  currentExamQuestion = 0;
  examAnswers = [];
  examCompleted = false;
  
  if (mode === 'normal') {
    examQuestionsFiltered = examQuestions.map(q => shuffleOptions(q));
  } else if (mode === 'final') {
    examQuestionsFiltered = shuffleArray(examQuestions.map(q => shuffleOptions(q))).slice(0, 20);
  } else {
    examQuestionsFiltered = shuffleArray(questionBank[mode] || []).map(q => shuffleOptions(q));
  }
  
  showExamQuestion();
  document.getElementById('exam-actions').innerHTML = '<button class="exam-btn exam-btn-primary" onclick="nextExamQuestion()">Próxima</button><button class="exam-btn exam-btn-secondary" onclick="showDifficultySelector()">Voltar</button>';
}

function closeExamMode() {
  document.getElementById('exam-modal').classList.remove('open');
  document.body.style.overflow = '';
  const data = getStoredData();
  data.examState = { currentQuestion: currentExamQuestion, answers: examAnswers, completed: examCompleted, mode: currentExamMode };
  saveData(data);
}

function showExamQuestion() {
  const q = examQuestionsFiltered[currentExamQuestion];
  const content = document.getElementById('exam-content');
  const total = examQuestionsFiltered.length;
  document.getElementById('exam-progress').textContent = 'Pergunta ' + (currentExamQuestion + 1) + ' de ' + total;
  
  let optionsHtml = q.options.map((opt, i) => 
    '<button class="exam-option ' + (examAnswers[currentExamQuestion] === i ? 'selected' : '') + '" onclick="selectExamAnswer(' + i + ')">' + opt + '</button>'
  ).join('');
  
  content.innerHTML = '<div class="exam-question-num">' + (currentExamQuestion + 1) + '</div><div class="exam-question-text">' + q.question + '</div><div class="exam-options">' + optionsHtml + '</div><div class="exam-result" id="exam-result"></div>';
  
  if (examAnswers[currentExamQuestion] !== undefined) showExamAnswerFeedback();
}

function selectExamAnswer(index) {
  examAnswers[currentExamQuestion] = index;
  showExamAnswerFeedback();
  const data = getStoredData();
  data.examState = { currentQuestion: currentExamQuestion, answers: examAnswers, completed: false, mode: currentExamMode };
  saveData(data);
}

function showExamAnswerFeedback() {
  const q = examQuestionsFiltered[currentExamQuestion];
  const selected = examAnswers[currentExamQuestion];
  const resultDiv = document.getElementById('exam-result');
  const options = document.querySelectorAll('.exam-option');
  
  options.forEach((opt, i) => {
    opt.classList.remove('selected', 'correct', 'wrong');
    if (i === selected) { 
      opt.classList.add('selected'); 
      opt.classList.add(i === q.answer ? 'correct' : 'wrong'); 
    }
    if (i === q.answer && selected !== q.answer) opt.classList.add('correct');
  });
  
  const isCorrect = selected === q.answer;
  resultDiv.className = 'exam-result show ' + (isCorrect ? 'correct' : 'incorrect');
  resultDiv.innerHTML = '<strong>' + (isCorrect ? 'Resposta correta!' : 'Resposta errada.') + '</strong><br>' + q.explanation;
}

function nextExamQuestion() {
  if (currentExamQuestion < examQuestionsFiltered.length - 1) {
    currentExamQuestion++;
    showExamQuestion();
  } else {
    examCompleted = true;
    showExamResults();
  }
}

function showExamResults() {
  const data = getStoredData();
  data.examState = { currentQuestion: currentExamQuestion, answers: examAnswers, completed: true, mode: currentExamMode };
  saveData(data);
  
  let correct = 0;
  examQuestionsFiltered.forEach((q, i) => { if (examAnswers[i] === q.answer) correct++; });
  
  const score = Math.round((correct / examQuestionsFiltered.length) * 100);
  const content = document.getElementById('exam-content');
  document.getElementById('exam-progress').textContent = 'Resultado Final';
  
  let reviewList = examQuestionsFiltered.map((q, i) => {
    const isCorrect = examAnswers[i] === q.answer;
    return '<div class="exam-review-item"><div class="exam-review-question">' + (i + 1) + '. ' + q.question + '</div><div class="exam-review-answer ' + (isCorrect ? 'correct' : 'wrong') + '">' + (isCorrect ? '✓ Correta' : '✗ Sua resposta: ' + q.options[examAnswers[i]]) + '<br>' + (!isCorrect ? 'Correta: ' + q.options[q.answer] : '') + '</div></div>';
  }).join('');
  
  content.innerHTML = '<div class="exam-results"><div class="exam-score">' + score + '%</div><div class="exam-score-label">' + correct + ' de ' + examQuestionsFiltered.length + ' perguntas corretas</div><div class="exam-review-list">' + reviewList + '</div></div>';
  document.getElementById('exam-actions').innerHTML = '<button class="exam-btn exam-btn-primary" onclick="startExam(currentExamMode)">Fazer novamente</button><button class="exam-btn exam-btn-secondary" onclick="closeExamMode()">Fechar</button>';
}

function restartExam() {
  startExam(currentExamMode);
}

function resetProgress() {
  if (confirm('Tem certeza que deseja resetar todo o progresso?')) {
    localStorage.removeItem(STORAGE_KEY);
    isReviewMode = false;
    document.body.classList.remove('review-mode-active');
    document.getElementById('btn-revisao').classList.remove('active');
    document.querySelectorAll('.accordion-header').forEach(h => { h.classList.remove('active'); h.nextElementSibling.classList.remove('open'); });
    document.querySelectorAll('.flashcard').forEach(card => { card.querySelector('.flashcard-meta').textContent = 'Pergunta'; card.querySelector('.flashcard-content').textContent = card.dataset.front; });
    document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelectorAll('.quiz-result').forEach(r => r.className = 'quiz-result');
    document.getElementById('exam-modal').classList.remove('open');
    currentExamQuestion = 0;
    examAnswers = [];
    examCompleted = false;
    showToast('Progresso resetado!');
  }
}

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function init() {
  const data = getStoredData();
  if (Object.keys(data).length > 0) setTimeout(() => showToast('Seu progresso foi restaurado'), 500);
  initReviewMode();
  
  window.addEventListener('scroll', () => {
    const sections = ['hero', 'mindmap', 'timeline', 'comparativo', 'durkheim', 'levy-bruhl', 'moscovici', 'freud', 'lebon', 'contemporanea', 'revisao'];
    let current = '';
    sections.forEach(id => {
      const s = document.getElementById(id);
      if (s && s.getBoundingClientRect().top <= 200) current = id;
    });
    document.querySelectorAll('.section-dot').forEach(d => d.classList.toggle('active', d.dataset.section === current));
  });
}

document.addEventListener('DOMContentLoaded', init);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js').then(() => {}, err => console.log('SW erro:', err)));
}

