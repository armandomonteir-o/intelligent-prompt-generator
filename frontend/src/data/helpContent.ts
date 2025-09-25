type HelpContentItem = {
  title: string;
  description: string;
};

type HelpContentGroup = {
  groupTitle: string;
  items: HelpContentItem[];
};

export const helpContent: HelpContentGroup[] = [
  {
    groupTitle: "Fundamentos do Prompt",
    items: [
      {
        title: "O que é um Prompt?",
        description:
          "Pense na Inteligência Artificial como um Chef de cozinha genial, mas que só segue ordens. O prompt é a sua receita. É o conjunto de instruções que você entrega para que a IA analise e prepare exatamente o prato que você imaginou. Em resumo, é como conversamos com uma IA.",
      },
      {
        title: "Qual a importância de um prompt bem escrito?",
        description:
          "Uma IA é uma ferramenta poderosa, mas ela não lê pensamentos. Um prompt bem escrito, com detalhes e uma estrutura clara, é o que transforma a IA de uma 'caixa de surpresas' em uma assistente de alta performance. Quanto melhor a sua receita, mais delicioso e preciso será o resultado, evitando respostas inesperadas e economizando seu tempo.",
      },
      {
        title: "Estruturas de um bom prompt",
        description:
          "Para garantir resultados incríveis sem frustração, especialmente para iniciantes, recomendamos uma estrutura de 5 partes essenciais: Papel, Objetivo, Audiência, Estilo e Formato. Cada parte funciona como um ingrediente crucial que, juntos, compõem uma receita de sucesso. Vamos detalhar a importância de cada uma a seguir.",
      },
    ],
  },
  {
    groupTitle: "Partes estruturais do prompt",
    items: [
      {
        title: "Papel",
        description:
          "Definir um 'Papel' é como escolher o especialista certo para a sua receita. Em vez de um cozinheiro genérico, você pode instruir a IA a agir como um 'Mestre Churrasqueiro do Texas' ou um 'Chef Pâtissier Francês'. Isso ativa todo o conhecimento, jargão e estilo daquela persona, resultando em respostas muito mais detalhadas, autênticas e úteis. A IA não só responde, ela incorpora o especialista.",
      },
      {
        title: "Objetivo",
        description:
          "Se o 'Papel' é quem cozinha, o 'Objetivo' é o prato que você pede. Um objetivo claro e específico é a diferença entre pedir 'comida' e pedir um 'risoto de cogumelos'. Quanto mais precisa for a sua ordem (o objetivo), mais a IA consegue focar sua energia criativa na tarefa, entregando um resultado coeso e sem desperdiçar tempo (e o seu dinheiro) com ingredientes que não fazem parte da receita.",
      },
      {
        title: "Público",
        description:
          "Para quem o Chef está cozinhando? Definir o 'Público' permite que a IA ajuste a complexidade da receita. Um prato para uma criança de 5 anos é simples e direto; um prato para um crítico gastronômico pode ser complexo e cheio de termos técnicos. Ao especificar se a resposta é para um 'iniciante curioso' ou um 'especialista no assunto', você garante que a IA use o vocabulário e a profundidade ideais, tornando o resultado final muito mais útil e relevante para quem vai 'consumir' a informação.",
      },
      {
        title: "Estilo",
        description:
          "O 'Estilo' é o tempero da receita, a 'personalidade' do seu Chef. Ele controla o tom de voz da resposta. Você quer que a IA explique um conceito como um professor universitário, com um tom formal e preciso? Ou como um amigo comediante, com um tom casual e divertido? Ao definir o Estilo, você instrui a IA não apenas sobre o que dizer, mas sobre como dizer, moldando a personalidade dela para se adequar perfeitamente à sua necessidade.",
      },
      {
        title: "Formato de Resposta",
        description:
          "Esta é a 'apresentação do prato'. Definir o 'Formato' instrui a IA sobre como organizar a resposta. É a diferença entre o Chef te contar uma história sobre os ingredientes ou te entregar uma ficha técnica organizada. Às vezes, você quer a história. Outras, você só precisa da lista. Ao pedir um formato específico como 'uma lista em tópicos', 'uma tabela com duas colunas' ou 'um guia passo a passo', você garante que a resposta venha estruturada exatamente como você precisa, economizando seu tempo e facilitando o uso da informação.",
      },
    ],
  },
];
