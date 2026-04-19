import 'dotenv/config'
import { db } from './index.js'
import { questions } from './schema.js'
import { count } from 'drizzle-orm'

// ---------------------------------------------------------------------------
// 100 perguntas Verdadeiro/Falso sobre Marvel Champions: The Card Game
// Distribuição: 40 beginner / 35 intermediate / 25 advanced
//               25 basic / 25 heroes / 20 villains / 15 advanced / 15 campaign
// ---------------------------------------------------------------------------

const seedQuestions = [
  // =========================================================================
  // BEGINNER — BASIC (15)
  // =========================================================================
  {
    statement: 'Na fase do vilão, o vilão sempre ataca o herói antes de avançar o esquema.',
    answer: false,
    explanation: 'Na fase do vilão, primeiro o esquema avança (ameaça é adicionada ao esquema principal) e somente depois ocorre o ataque do vilão — e apenas se o herói estiver na forma Herói, não Alter Ego.',
    category: 'basic' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'O jogo termina imediatamente quando o vilão completa o último estágio do esquema.',
    answer: true,
    explanation: 'Se a ameaça no esquema principal atingir o limite máximo, os jogadores perdem imediatamente. O vilão vence ao completar seu plano nefasto.',
    category: 'basic' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'Um herói pode usar cartas de evento (event) sem pagar seu custo de recurso.',
    answer: false,
    explanation: 'Todo card jogado da mão deve ter seu custo pago com recursos. Os recursos podem vir de cartas descartadas, habilidades de aliados ou efeitos de cartas específicas.',
    category: 'basic' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'Durante a fase do jogador, o herói pode jogar quantas cartas quiser da mão.',
    answer: true,
    explanation: 'Não existe limite para quantas cartas o jogador pode jogar durante seu turno, desde que pague os custos de cada uma delas.',
    category: 'basic' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'O jogador compra cartas até a mão cheia somente no início do turno.',
    answer: false,
    explanation: 'O jogador compra cartas até encher a mão no final do seu turno (fase de preparação/cleanup), não no início. No início do turno começa a fase do vilão.',
    category: 'basic' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'Um Alter Ego pode recuperar pontos de vida gastando uma ação de recuperação.',
    answer: true,
    explanation: 'Quando na forma Alter Ego, o jogador pode usar a ação de recuperação para recuperar pontos de vida igual ao valor de REC (Recuperação) do personagem.',
    category: 'basic' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'A forma Alter Ego pode atacar o vilão diretamente.',
    answer: false,
    explanation: 'Apenas a forma Herói pode realizar ataques. Na forma Alter Ego, o personagem não pode atacar — pode apenas se recuperar e usar habilidades de Alter Ego.',
    category: 'basic' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'Quando um herói é derrotado (HP chega a 0), o jogador perde o jogo imediatamente.',
    answer: true,
    explanation: 'Se os pontos de vida do herói chegarem a zero, esse jogador é eliminado. Em jogo solo, isso significa derrota imediata.',
    category: 'basic' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'O baralho de encontro (encounter deck) é compartilhado por todos os jogadores em modo cooperativo.',
    answer: true,
    explanation: 'Em modo multijogador cooperativo, todos os jogadores usam o mesmo baralho de encontro. Cada jogador recebe seu próprio card de encontro por turno.',
    category: 'basic' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'Um aliado (ally) pode tanto atacar quanto defender no mesmo turno.',
    answer: false,
    explanation: 'Um aliado exausto não pode ser usado novamente no mesmo turno. Se um aliado atacou, ele é exausto e não pode mais defender naquele turno, e vice-versa.',
    category: 'basic' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'Cartas de recurso (resource) descartadas durante o pagamento de custo vão para o descarte.',
    answer: true,
    explanation: 'Quando você descarta uma carta da mão para gerar recursos, essa carta vai para o seu descarte pessoal, não para o descarte do encontro.',
    category: 'basic' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'O herói começa cada partida já na forma Herói.',
    answer: false,
    explanation: 'O herói começa o jogo na forma Alter Ego, com o lado do Alter Ego voltado para cima. A mudança para a forma Herói é uma ação voluntária do jogador.',
    category: 'basic' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'A cada turno, cada jogador recebe exatamente 1 carta do baralho de encontro.',
    answer: true,
    explanation: 'Durante a fase do vilão, após o avanço do esquema e o possível ataque do vilão, cada jogador compra 1 carta do baralho de encontro e resolve seus efeitos.',
    category: 'basic' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'Se o baralho do jogador acabar, ele perde o jogo imediatamente.',
    answer: false,
    explanation: 'Quando o baralho do jogador acaba, o descarte é embaralhado para formar um novo baralho. O jogador não perde o jogo por isso.',
    category: 'basic' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'Mudar de Herói para Alter Ego (ou vice-versa) é uma ação que custa uma ação de turno.',
    answer: false,
    explanation: 'Mudar de forma (Herói ↔ Alter Ego) é uma ação gratuita que pode ser feita como a primeira coisa no turno do jogador, antes de qualquer outra ação.',
    category: 'basic' as const,
    difficulty: 'beginner' as const,
  },

  // =========================================================================
  // BEGINNER — HEROES (12)
  // =========================================================================
  {
    statement: 'O Homem-Aranha (Peter Parker) tem uma habilidade especial que permite jogar cartas de evento como respostas fora do seu turno.',
    answer: true,
    explanation: 'A habilidade "Sentido de Aranha" do Homem-Aranha permite jogar cartas de evento com a palavra-chave Interrupt ou Response fora do turno normal, uma mecânica única de seu kit.',
    category: 'heroes' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'Capitã Marvel começa o jogo com cartas de energia no jogo, prontas para usar.',
    answer: true,
    explanation: 'A Capitã Marvel possui tokens de energia que são gerados passivamente e podem ser usados para pagar custos ou ativar habilidades especiais.',
    category: 'heroes' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'O Ferro (Iron Man) começa o jogo com todos os seus upgrades de armadura já em jogo.',
    answer: false,
    explanation: 'O Iron Man começa sem armadura. Seus upgrades de armadura (helmet, chest, repulsor, boots) devem ser jogados ao longo da partida para liberar seu potencial máximo.',
    category: 'heroes' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'Ela-Hulk (She-Hulk) pode tanto atacar quanto se defender com valores altos por ser uma das heroínas mais fortes fisicamente.',
    answer: true,
    explanation: 'She-Hulk possui os maiores valores base de ATK e DEF entre os heróis iniciais, refletindo sua força sobre-humana, tornando-a excelente tanto no ataque quanto na defesa.',
    category: 'heroes' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'Thor pode descartar cartas da mão para gerar recursos de qualquer tipo.',
    answer: false,
    explanation: 'Thor, como todos os heróis, gera recursos do tipo específico das cartas descartadas. Ele tem acesso especial a recursos de Energia (raio), mas não pode gerar qualquer tipo de recurso livremente.',
    category: 'heroes' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'O alter ego do Homem-Aranha é Peter Parker.',
    answer: true,
    explanation: 'Peter Parker é o alter ego do Homem-Aranha. Na forma Alter Ego, ele possui habilidades relacionadas à sua vida civil e pode usar a ação de recuperação normalmente.',
    category: 'heroes' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'Pantera Negra (Black Panther) possui a habilidade de preparar upgrades automaticamente no início do turno.',
    answer: false,
    explanation: 'Pantera Negra tem a habilidade "Vibranium" que permite instalar upgrades de Vibranium únicos. Esses upgrades não são preparados automaticamente — eles ficam em jogo permanentemente sem custo de manutenção.',
    category: 'heroes' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'Ms. Marvel pode crescer (Embiggen) para aumentar seu ATK e DEF temporariamente.',
    answer: true,
    explanation: 'Ms. Marvel possui a habilidade "Embiggen" que aumenta seu ATK para 3 e DEF para 3 ao mudar para a forma Herói, representando sua capacidade de aumentar o tamanho do corpo.',
    category: 'heroes' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'Groot como herói não pode usar cartas aliadas de outros heróis.',
    answer: false,
    explanation: 'Groot pode usar qualquer aliado que não seja exclusivo de outro herói (sem o ícone de aspecto específico). As restrições de aliados se aplicam aos aspectos (Aggression, Justice, etc.), não ao herói específico.',
    category: 'heroes' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'O Visão (Vision) pode mudar sua densidade, o que afeta seus valores de ATK e DEF.',
    answer: true,
    explanation: 'Visão pode alternar entre forma densa e etérea durante o jogo. Forma densa aumenta ATK mas reduz DEF (ou vice-versa), representando suas habilidades de controle de densidade.',
    category: 'heroes' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'Ant-Man (Scott Lang) em forma pequena (ant-size) tem valores de ATK e DEF reduzidos.',
    answer: false,
    explanation: 'Quando em tamanho de formiga (ant-size), Ant-Man na verdade ganha bônus especiais. Sua forma gigante (giant) também oferece vantagens únicas — cada forma tem seus próprios benefícios.',
    category: 'heroes' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'Viúva Negra (Black Widow) tem uma mecânica especial ligada a preparação de cartas.',
    answer: true,
    explanation: 'Viúva Negra possui a habilidade "Preparação" e muitas de suas cartas permitem preparar cartas exaustas, permitindo usar aliados e upgrades múltiplas vezes no mesmo turno.',
    category: 'heroes' as const,
    difficulty: 'beginner' as const,
  },

  // =========================================================================
  // BEGINNER — VILLAINS (8)
  // =========================================================================
  {
    statement: 'Rhino é considerado um vilão de nível iniciante, ideal para as primeiras partidas.',
    answer: true,
    explanation: 'Rhino é o vilão recomendado para iniciantes, presente na caixa base. Ele possui mecânicas simples de entender e é usado para ensinar as regras básicas do jogo.',
    category: 'villains' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'O vilão avança o esquema uma vez por turno de forma automática, independente de qualquer outra coisa.',
    answer: false,
    explanation: 'A ameaça é adicionada ao esquema de acordo com o valor de Scheme Threat do vilão. Alguns efeitos de encontro ou minions podem adicionar ameaça extra além do valor base.',
    category: 'villains' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'Quando um vilão ataca um herói que está defendendo, o herói não sofre dano.',
    answer: false,
    explanation: 'Um herói que declara defesa absorve o dano do ataque do vilão. Se o dano exceder o DEF do herói, o excesso é aplicado como dano ao herói defensor.',
    category: 'villains' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'Klaw é um vilão que possui estágios múltiplos, ficando mais poderoso ao progredir.',
    answer: true,
    explanation: 'Klaw é um vilão de múltiplos estágios da caixa base. Ao ser derrotado no primeiro estágio, ele passa para o estágio 2 com HP e habilidades aumentadas.',
    category: 'villains' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'Vilões nunca podem se curar durante a partida.',
    answer: false,
    explanation: 'Alguns vilões possuem habilidades de cura ou cartas do baralho de encontro que curam o vilão. Verificar as cartas específicas de cada vilão é fundamental.',
    category: 'villains' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'O baralho de encontro é montado com as cartas específicas do vilão mais um conjunto modular de cartas.',
    answer: true,
    explanation: 'O baralho de encontro é formado pelas cartas obrigatórias do vilão (Villain cards) mais conjuntos modulares específicos indicados no card do cenário.',
    category: 'villains' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'Ultron é um dos vilões presentes na caixa base de Marvel Champions.',
    answer: true,
    explanation: 'Ultron é o terceiro vilão da caixa base (após Rhino e Klaw). Ele é considerado mais desafiador e possui mecânicas envolvendo drones que são colocados em jogo.',
    category: 'villains' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'Quando um minion entra em jogo, ele imediatamente ataca o herói.',
    answer: false,
    explanation: 'Minions entram em jogo, mas só atacam durante a fase do vilão do próximo turno (ou imediatamente se tiverem a keyword "Quickstrike"). Sem Quickstrike, o minion espera seu turno.',
    category: 'villains' as const,
    difficulty: 'beginner' as const,
  },

  // =========================================================================
  // BEGINNER — ADVANCED MECHANICS (3)
  // =========================================================================
  {
    statement: 'O keyword "Toughness" faz com que a carta receba um token Tough ao entrar em jogo.',
    answer: true,
    explanation: 'Cartas com Toughness entram em jogo com um token Tough. O primeiro dano ou efeito prejudicial que a carta sofreria é cancelado e o token Tough é removido.',
    category: 'advanced' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'Um herói com o status "Stunned" não pode realizar ações no próximo turno.',
    answer: false,
    explanation: 'Um herói com status Stunned perde apenas 1 ação durante o próximo turno (especificamente a ação de ataque/defesa). O status é removido após ser usado ou ao final do turno.',
    category: 'advanced' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'O status "Confused" impede o herói de usar habilidades de Thwart (Frustrar).',
    answer: true,
    explanation: 'Um herói Confused não pode usar ações de Thwart para remover ameaça do esquema. O status Confused é removido após impedir uma ação de Thwart.',
    category: 'advanced' as const,
    difficulty: 'beginner' as const,
  },

  // =========================================================================
  // BEGINNER — CAMPAIGN (2)
  // =========================================================================
  {
    statement: 'No modo campanha, os jogadores podem começar cada missão com cartas adicionais desbloqueadas de partidas anteriores.',
    answer: true,
    explanation: 'O modo campanha permite que os jogadores ganhem recompensas entre missões, incluindo cartas extras e upgrades permanentes que persistem ao longo da campanha.',
    category: 'campaign' as const,
    difficulty: 'beginner' as const,
  },
  {
    statement: 'No modo campanha, a derrota em uma missão significa que toda a campanha está perdida.',
    answer: false,
    explanation: 'Em muitas campanhas, a derrota em uma missão resulta em consequências negativas (como dano extra ou menos recursos na próxima missão), mas a campanha pode continuar.',
    category: 'campaign' as const,
    difficulty: 'beginner' as const,
  },

  // =========================================================================
  // INTERMEDIATE — BASIC (7)
  // =========================================================================
  {
    statement: 'Um herói pode usar recursos adicionais após pagar o custo de uma carta para obter efeitos bônus.',
    answer: false,
    explanation: 'Você paga exatamente o custo de uma carta — nem mais, nem menos (a menos que uma carta específica permita sobre-pagar para ganhar bônus). Recursos excedentes não podem ser armazenados.',
    category: 'basic' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'Cartas de suporte (support) permanecem em jogo até serem destruídas ou removidas por efeito de carta.',
    answer: true,
    explanation: 'Diferente dos eventos que são descartados após o uso, as cartas de suporte ficam em jogo e fornecem benefícios passivos ou habilidades ativáveis enquanto estiverem em jogo.',
    category: 'basic' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'Em modo solo, o jogador compra 2 cartas de encontro por turno para compensar a falta de outros jogadores.',
    answer: false,
    explanation: 'Em modo solo, o jogador ainda compra apenas 1 carta de encontro por turno. A dificuldade é ajustada de outras formas (como o HP do vilão que escala com o número de jogadores).',
    category: 'basic' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'Um personagem exausto pode ser alvo de um ataque do vilão mesmo que outro personagem disponível esteja em jogo.',
    answer: true,
    explanation: 'O vilão ataca o herói principal (a menos que um aliado declare defesa ou um efeito específico redirecione o ataque). A exaustão de aliados não impede o herói de ser atacado.',
    category: 'basic' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'Quando um aliado é derrotado em combate, ele vai para o descarte e sua carta pode ser recuperada normalmente.',
    answer: true,
    explanation: 'Aliados derrotados (HP chegando a 0) vão para o descarte pessoal do jogador. Como qualquer carta do descarte, podem ser reciclados quando o baralho acabar.',
    category: 'basic' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'O dano causado ao herói entre turnos é permanente e não pode ser recuperado sem usar a ação de recuperação.',
    answer: false,
    explanation: 'Alguns cards, upgrades e habilidades podem curar dano sem precisar usar a ação de recuperação do Alter Ego. Além disso, certos heróis possuem habilidades de cura na forma Herói.',
    category: 'basic' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'Cartas de Treino (training upgrades) geralmente fornecem recursos adicionais ou melhoram as estatísticas do herói.',
    answer: true,
    explanation: 'Upgrades de treino são cartas que ficam em jogo e melhoram as capacidades do herói, seja adicionando recursos, aumentando ATK/DEF/THW ou fornecendo novas habilidades.',
    category: 'basic' as const,
    difficulty: 'intermediate' as const,
  },

  // =========================================================================
  // INTERMEDIATE — HEROES (10)
  // =========================================================================
  {
    statement: 'Warlock (Adam Warlock) pode usar cartas de qualquer aspecto sem restrições.',
    answer: true,
    explanation: 'Adam Warlock possui a habilidade única de incluir cartas de qualquer aspecto em seu baralho. Porém, está sujeito ao limite de cartas por aspecto e precisa pagar os custos normalmente.',
    category: 'heroes' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'Wanda Maximoff (Scarlet Witch) pode manipular o baralho de encontro para controlar quais cartas aparecem.',
    answer: true,
    explanation: 'Feiticeira Escarlate possui habilidades de manipulação do baralho de encontro, podendo remover ou reordenar cartas, refletindo seus poderes de manipulação da realidade.',
    category: 'heroes' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'Hawkeye (Gavião Arqueiro) depende de ter diferentes tipos de flechas em jogo para maximizar seu potencial.',
    answer: true,
    explanation: 'O Gavião Arqueiro possui múltiplos tipos de flechas (trick arrows) que funcionam como upgrades, cada um com efeitos diferentes. Ter o estoque certo de flechas é crucial para sua estratégia.',
    category: 'heroes' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'Thor pode usar o Mjolnir como recurso para pagar o custo de cartas.',
    answer: false,
    explanation: 'Mjolnir é um upgrade especial de Thor. Ele não pode ser descartado como recurso comum. Thor pode usar cartas de sua mão normalmente como recursos, mas o Mjolnir permanece em jogo.',
    category: 'heroes' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'Gamora possui uma habilidade que lida com cartas específicas de vilões e minions.',
    answer: true,
    explanation: 'Gamora tem mecânicas que se beneficiam de derrotar inimigos específicos ou de ter minions com marcadores de dano, refletindo seu papel como a mulher mais perigosa da galáxia.',
    category: 'heroes' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'Drax tem uma habilidade passiva que se ativa quando ele sofre dano.',
    answer: true,
    explanation: 'Drax possui a habilidade "Vingança" (Vengeance) que coloca tokens de vingança quando ele sofre dano. Esses tokens podem ser usados para aumentar seu poder de ataque.',
    category: 'heroes' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'Rocket Raccoon pode usar partes e equipamentos para criar upgrades durante a partida.',
    answer: true,
    explanation: 'Rocket possui a habilidade de fabricar equipamentos usando recursos, refletindo seu talento para criar gadgets. Ele tem upgrades únicos que representam seus inventos.',
    category: 'heroes' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'Star-Lord (Peter Quill) pode ignorar o custo de cartas de eventos de aspecto específico.',
    answer: false,
    explanation: 'Star-Lord possui habilidades de liderança e pode usar cartas de vários aspectos, mas ainda precisa pagar o custo de todas as cartas normalmente. Sua habilidade única envolve bonus por aspecto, não isenção de custo.',
    category: 'heroes' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'Spider-Woman (Jessica Drew) pode usar cartas de dois aspectos diferentes.',
    answer: true,
    explanation: 'Spider-Woman tem acesso a dois aspectos diferentes em seu baralho (como Aggression e Protection), tornando-a versátil para diferentes estratégias.',
    category: 'heroes' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'Capitão América pode preparar cartas de aliado usando seu escudo.',
    answer: false,
    explanation: 'O escudo do Capitão América é usado principalmente para defesa e ataques. Sua habilidade de inspiração é diferente — ele prepara cartas ao usar habilidades de liderança, não especificamente com o escudo.',
    category: 'heroes' as const,
    difficulty: 'intermediate' as const,
  },

  // =========================================================================
  // INTERMEDIATE — VILLAINS (9)
  // =========================================================================
  {
    statement: 'Shadowcat é uma vilã com mecânicas que envolvem entrar e sair de cobertura.',
    answer: false,
    explanation: 'Shadowcat é uma heroína (X-Men), não uma vilã. Os vilões do jogo incluem Taskmaster, Crossbones, Zemo entre outros das expansões.',
    category: 'villains' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'O Crânio Vermelho (Red Skull) como vilão possui cartas de Hydra em seu baralho de encontro.',
    answer: true,
    explanation: 'Na expansão "The Rise of Red Skull", o baralho de encontro do Crânio Vermelho inclui agentes e recursos da Hydra, tornando-o um vilão mais complexo com múltiplas camadas de ameaça.',
    category: 'villains' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'Taskmaster copia as habilidades dos heróis para usá-las contra eles.',
    answer: true,
    explanation: 'Taskmaster possui a mecânica de absorver técnicas de combate. Suas cartas de encontro podem replicar habilidades ou criar ameaças baseadas nas próprias capacidades dos heróis.',
    category: 'villains' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'Crossbones é um vilão com foco em dano direto e pode matar aliados rapidamente.',
    answer: true,
    explanation: 'Crossbones é um vilão agressivo com alto poder de ataque. Suas cartas de encontro frequentemente causam dano em área ou eliminam aliados, tornando a proteção dos personagens secundários crítica.',
    category: 'villains' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'O esquema do vilão avança mais rápido quando há mais jogadores na mesa.',
    answer: true,
    explanation: 'Em modo multijogador, a ameaça adicionada ao esquema por turno é multiplicada pelo número de jogadores. Isso cria pressão adicional, equilibrando a vantagem de ter mais heróis.',
    category: 'villains' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'Loki pode trocar os baralhos de heróis, confundindo os jogadores.',
    answer: false,
    explanation: 'Loki possui habilidades de ilusão e manipulação, mas não literalmente troca os baralhos dos heróis. Suas mecânicas envolvem criar ilusões ou alterar regras do jogo através de seus esquemas e treacheries.',
    category: 'villains' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'Alguns cenários possuem objetivos secundários além de derrotar o vilão.',
    answer: true,
    explanation: 'Muitos cenários possuem side schemes (esquemas secundários) que, se não forem tratados, fornecem benefícios ao vilão. Além disso, alguns cenários têm vitórias alternativas baseadas em objetivos específicos.',
    category: 'villains' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'Quando um side scheme é completado pelos vilões, o jogo termina imediatamente.',
    answer: false,
    explanation: 'Side schemes completados geram efeitos negativos ou bônus ao vilão, mas normalmente não terminam o jogo. Apenas o esquema principal chegando ao limite ou o herói sendo derrotado encerram a partida.',
    category: 'villains' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'O Barão Zemo usa um exército de super-soldados como parte de sua estratégia.',
    answer: true,
    explanation: 'Barão Zemo como vilão possui soldados e agentes da Hydra em seu baralho de encontro. Sua estratégia envolve criar minions que travam os heróis enquanto seus esquemas avançam.',
    category: 'villains' as const,
    difficulty: 'intermediate' as const,
  },

  // =========================================================================
  // INTERMEDIATE — ADVANCED MECHANICS (5)
  // =========================================================================
  {
    statement: 'O keyword "Overkill" faz com que o dano excedente ao derrotar um inimigo seja aplicado ao próximo alvo.',
    answer: true,
    explanation: 'Cartas com Overkill permitem que o dano excedente (acima do HP restante do inimigo) seja transferido para outro alvo elegível, como o vilão ou outro minion.',
    category: 'advanced' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'O keyword "Quickstrike" permite que um minion ataque imediatamente ao entrar em jogo.',
    answer: true,
    explanation: 'Minions com Quickstrike realizam um ataque imediatamente quando entram em jogo, sem esperar o próximo turno. Isso os torna especialmente perigosos e pode ser surpresa para jogadores despreparados.',
    category: 'advanced' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'O status "Stunned" impede o vilão de avançar o esquema no próximo turno.',
    answer: false,
    explanation: 'O status Stunned em um vilão impede que ele realize seu ataque naquele turno, mas o esquema ainda avança normalmente. Stunned remove apenas o ataque, não o avanço do esquema.',
    category: 'advanced' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'Tokens de ameaça podem ser removidos do esquema principal usando a ação de Thwart.',
    answer: true,
    explanation: 'A ação de Thwart (Frustrar) usa o valor de THW do personagem para remover tokens de ameaça dos esquemas em jogo. É a principal forma de controlar o avanço do esquema do vilão.',
    category: 'advanced' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'O keyword "Piercing" ignora o token Tough do alvo.',
    answer: true,
    explanation: 'Cartas com Piercing ignoram o token Tough do alvo, causando dano diretamente mesmo que o alvo tenha proteção. É essencial contra inimigos com Toughness.',
    category: 'advanced' as const,
    difficulty: 'intermediate' as const,
  },

  // =========================================================================
  // INTERMEDIATE — CAMPAIGN (4)
  // =========================================================================
  {
    statement: 'Na campanha "The Rise of Red Skull", os jogadores enfrentam 5 encontros em sequência.',
    answer: true,
    explanation: 'A campanha Rise of Red Skull (primeira expansão de campanha) possui 5 missões jogadas em sequência, cada uma com seu próprio vilão e narrativa conectada.',
    category: 'campaign' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'Nas campanhas, os heróis mantêm seu dano entre as missões.',
    answer: false,
    explanation: 'Entre missões de campanha, os heróis são totalmente curados (HP reseta). As consequências entre missões geralmente envolvem traumas (limitações de deck) ou bônus, não dano persistente.',
    category: 'campaign' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'A campanha "Galaxy\'s Most Wanted" apresenta vilões dos Guardiões da Galáxia.',
    answer: false,
    explanation: 'Galaxy\'s Most Wanted é uma campanha focada nos Guardiões da Galáxia como heróis, mas os vilões são antagonistas do universo cósmico Marvel (Ronan, Nebula, Thanos etc.), não os próprios Guardiões.',
    category: 'campaign' as const,
    difficulty: 'intermediate' as const,
  },
  {
    statement: 'Em campanhas, sofrer uma derrota pode conceder ao vilão uma vantagem permanente nas missões seguintes.',
    answer: true,
    explanation: 'Muitas campanhas possuem regras de derrota onde o vilão ganha um bônus (como HP adicional, ameaça extra ou habilidades especiais) nas missões seguintes se os heróis falharem.',
    category: 'campaign' as const,
    difficulty: 'intermediate' as const,
  },

  // =========================================================================
  // ADVANCED — BASIC (3)
  // =========================================================================
  {
    statement: 'Em multiplayer, todos os jogadores devem usar o mesmo aspecto (Aggression, Justice, etc.).',
    answer: false,
    explanation: 'Em multiplayer, cada jogador pode usar um aspecto diferente. Na verdade, é recomendado usar aspectos variados para cobrir diferentes necessidades (controle de ameaça, dano, proteção, etc.).',
    category: 'basic' as const,
    difficulty: 'advanced' as const,
  },
  {
    statement: 'Quando um recurso de "double" (dois ícones) é usado, ele pode pagar por 2 recursos de uma carta de custo 2.',
    answer: false,
    explanation: 'Um ícone de recurso duplo conta como 2 recursos do mesmo tipo. No entanto, uma única carta descartada pode ter apenas um tipo de recurso — o valor duplo apenas significa que ela conta como 2 daquele tipo, não como 2 tipos diferentes.',
    category: 'basic' as const,
    difficulty: 'advanced' as const,
  },
  {
    statement: 'O jogador pode jogar cartas de sua mão como recursos mesmo durante a fase do vilão, para pagar por habilidades de resposta.',
    answer: true,
    explanation: 'Cartas de resposta (Response/Interrupt) fora do turno do jogador ainda precisam ter seus custos pagos, e o jogador pode descartar cartas da mão como recursos para pagar por essas respostas.',
    category: 'basic' as const,
    difficulty: 'advanced' as const,
  },

  // =========================================================================
  // ADVANCED — HEROES (3)
  // =========================================================================
  {
    statement: 'Thor pode usar Mjolnir para adicionar recursos de raio (lightning) ao pool de recursos de qualquer carta que ele jogar.',
    answer: false,
    explanation: 'Mjolnir gera recursos especiais de energia de Asgard, mas esses recursos só podem ser usados para pagar cartas compatíveis. Não é um gerador universal de recursos de raio.',
    category: 'heroes' as const,
    difficulty: 'advanced' as const,
  },
  {
    statement: 'Iron Man com todas as peças da armadura tem um dos maiores potenciais de ataque entre os heróis.',
    answer: true,
    explanation: 'Com todos os upgrades de armadura (Mark V) instalados, Iron Man atinge valores de ATK superiores a maioria dos heróis. Sua armadura completa representa um dos picos de poder mais altos do jogo.',
    category: 'heroes' as const,
    difficulty: 'advanced' as const,
  },
  {
    statement: 'Adam Warlock pode ter cartas de todos os 4 aspectos em seu baralho ao mesmo tempo.',
    answer: true,
    explanation: 'Esta é a habilidade definidora de Adam Warlock — ele pode incluir até 3 cartas de qualquer aspecto (Aggression, Justice, Leadership, Protection) em seu baralho único, algo impossível para outros heróis.',
    category: 'heroes' as const,
    difficulty: 'advanced' as const,
  },

  // =========================================================================
  // ADVANCED — VILLAINS (3)
  // =========================================================================
  {
    statement: 'O Thanos possui um esquema especial envolvendo as Joias do Infinito.',
    answer: true,
    explanation: 'Thanos como vilão possui mecânicas das Joias do Infinito que vão sendo coletadas ao longo do jogo. Cada joia confere poderes adicionais ao Thanos, aumentando progressivamente a dificuldade.',
    category: 'villains' as const,
    difficulty: 'advanced' as const,
  },
  {
    statement: 'Galactus pode ser vencido normalmente reduzindo seus pontos de vida a zero.',
    answer: false,
    explanation: 'Galactus possui regras especiais — ele é considerado quase imbatível em combate direto. A vitória contra Galactus geralmente envolve completar objetivos específicos ou usar a Crise cósmica para afastá-lo.',
    category: 'villains' as const,
    difficulty: 'advanced' as const,
  },
  {
    statement: 'Nebula no modo vilão possui um mecanismo de automodificação que a torna mais poderosa ao longo da partida.',
    answer: true,
    explanation: 'Nebula possui mecânicas de implantes cibernéticos que vão sendo adicionados ao longo do jogo, melhorando suas capacidades. Cada implante ativo fornece bônus permanentes que acumulam ao longo da partida.',
    category: 'villains' as const,
    difficulty: 'advanced' as const,
  },

  // =========================================================================
  // ADVANCED — ADVANCED MECHANICS (7)
  // =========================================================================
  {
    statement: 'O keyword "Surge" significa que após resolver a carta, o jogador compra uma carta adicional do baralho de encontro.',
    answer: true,
    explanation: 'Cartas com Surge no baralho de encontro fazem o jogador comprar mais uma carta de encontro após resolver essa. Isso pode criar efeitos em cascata potencialmente devastadores.',
    category: 'advanced' as const,
    difficulty: 'advanced' as const,
  },
  {
    statement: 'O keyword "Peril" impede os outros jogadores de jogar cartas para ajudar no encontro.',
    answer: true,
    explanation: 'Peril significa que somente o jogador que comprou a carta de encontro pode responder a ela. Outros jogadores não podem jogar cartas ou usar habilidades para ajudar a resolver esse encontro.',
    category: 'advanced' as const,
    difficulty: 'advanced' as const,
  },
  {
    statement: '"Retaliate X" significa que quando essa carta sofre dano, ela causa X de dano de volta ao atacante.',
    answer: true,
    explanation: 'Retaliate X é ativado quando a carta com essa keyword sofre dano. Ela então causa X dano ao personagem que a atacou — uma razão para considerar usar defesa ou overkill em vez de ataques diretos.',
    category: 'advanced' as const,
    difficulty: 'advanced' as const,
  },
  {
    statement: 'O keyword "Stalwart" em um vilão ou minion impede que ele receba tokens de status como Stunned ou Confused.',
    answer: true,
    explanation: 'Stalwart torna o portador imune a tokens de status (Stunned, Confused, etc.). Isso é significativo porque remove as opções de controle de muitos heróis e obriga os jogadores a usar estratégias alternativas.',
    category: 'advanced' as const,
    difficulty: 'advanced' as const,
  },
  {
    statement: '"Guard" em um minion significa que o herói principal deve primeiro derrotar esse minion antes de poder atacar o vilão.',
    answer: true,
    explanation: 'Minions com Guard bloqueiam ataques diretos ao vilão. Os heróis são forçados a desviar recursos para eliminar esses guardas antes de poderem atacar o vilão diretamente.',
    category: 'advanced' as const,
    difficulty: 'advanced' as const,
  },
  {
    statement: 'O keyword "Steady" em uma carta de encontro remove automaticamente um token de dano da carta ao início de cada turno do vilão.',
    answer: false,
    explanation: 'Steady é uma keyword que remove um token de boost de encontro ao início de cada turno — não tokens de dano. Ela é usada em minions e side schemes para remover marcadores de avanço.',
    category: 'advanced' as const,
    difficulty: 'advanced' as const,
  },
  {
    statement: 'Em partidas multiplayer, quando um jogador está na forma Alter Ego, o vilão ainda pode atacá-lo com um side scheme.',
    answer: true,
    explanation: 'Embora o vilão não ataque diretamente um personagem em Alter Ego, side schemes e alguns efeitos de encontro podem ainda afetar todos os jogadores, incluindo aqueles na forma Alter Ego.',
    category: 'advanced' as const,
    difficulty: 'advanced' as const,
  },

  // =========================================================================
  // ADVANCED — CAMPAIGN (9)
  // =========================================================================
  {
    statement: 'Na campanha "Mad Titan\'s Shadow", os jogadores enfrentam os Black Order a serviço de Thanos.',
    answer: true,
    explanation: 'Mad Titan\'s Shadow apresenta os membros do Black Order (Ebony Maw, Proxima Midnight, Corvus Glaive, Cull Obsidian e Black Dwarf) como vilões principais, servindo ao plano de Thanos.',
    category: 'campaign' as const,
    difficulty: 'advanced' as const,
  },
  {
    statement: 'A campanha "Mutant Genesis" introduz os X-Men como heróis jogáveis pela primeira vez.',
    answer: false,
    explanation: 'Alguns X-Men já estavam disponíveis em packs anteriores. Mutant Genesis expande o roster dos X-Men, mas não é estritamente "a primeira vez" — Wolverine e Ciclope, por exemplo, foram lançados antes.',
    category: 'campaign' as const,
    difficulty: 'advanced' as const,
  },
  {
    statement: 'Na campanha "The Hood", os jogadores enfrentam os Syndicate — um grupo de vilões do baixo escalão.',
    answer: true,
    explanation: 'The Hood apresenta a ameaça do Sindicato do Capuz, com vilões como o próprio Hood e seus capangas. A campanha foca em crime organizado sobrenatural no universo Marvel.',
    category: 'campaign' as const,
    difficulty: 'advanced' as const,
  },
  {
    statement: 'Traumas adquiridos em campanhas ficam permanentemente no baralho do herói, não podendo ser removidos.',
    answer: false,
    explanation: 'Traumas são adicionados ao baralho do herói e representam desvantagens. No entanto, alguns cenários ou recompensas de campanha podem permitir remover traumas acumulados.',
    category: 'campaign' as const,
    difficulty: 'advanced' as const,
  },
  {
    statement: 'Em campanhas cooperativas com múltiplos jogadores, todos os jogadores sofrem as consequências de derrota juntos.',
    answer: true,
    explanation: 'Em modo cooperativo de campanha, a derrota é coletiva. Se o grupo falhar em uma missão, todos sofrem as penalidades definidas pelo cenário antes de tentar a próxima missão.',
    category: 'campaign' as const,
    difficulty: 'advanced' as const,
  },
  {
    statement: 'A campanha "Age of Apocalypse" torna o vilão En Sabah Nur um dos mais difíceis do jogo base.',
    answer: false,
    explanation: 'Age of Apocalypse é uma expansão separada, não parte do jogo base. Apocalipse é de fato um vilão poderoso, mas é material de expansão, não da caixa base.',
    category: 'campaign' as const,
    difficulty: 'advanced' as const,
  },
  {
    statement: 'Alguns villain decks de campanha incluem cartas que alteram as regras permanentemente para o resto da campanha ao serem reveladas.',
    answer: true,
    explanation: 'Certas treacheries e esquemas de campanha têm efeitos "Permanentes" que modificam as regras globais do jogo para todas as missões subsequentes, aumentando a narrativa e a dificuldade progressiva.',
    category: 'campaign' as const,
    difficulty: 'advanced' as const,
  },
  {
    statement: 'O modo Espetacular (Spectacular) aumenta a dificuldade das campanhas adicionando um conjunto especial de cartas de encontro.',
    answer: true,
    explanation: 'O modo Espetacular é uma dificuldade elevada disponível em expansões de campanha, que adiciona um conjunto de cartas de encontro específicas tornando os encontros mais agressivos e perigosos.',
    category: 'campaign' as const,
    difficulty: 'advanced' as const,
  },
  {
    statement: 'Em campanhas, o Modo Expert pode ser combinado com dificuldade Espetacular para criar o desafio máximo.',
    answer: true,
    explanation: 'Os jogadores podem combinar o Expert Mode (que modifica o baralho de encontro do vilão) com o Modo Espetacular para criar campanhas extremamente desafiadoras, recomendadas apenas para jogadores muito experientes.',
    category: 'campaign' as const,
    difficulty: 'advanced' as const,
  },
]

async function main() {
  const result = await db.select({ total: count() }).from(questions)
  if (result[0].total > 0) {
    console.log(`Banco já possui ${result[0].total} perguntas. Seed ignorado.`)
    process.exit(0)
  }

  await db.insert(questions).values(seedQuestions)
  console.log(`Seed concluído: ${seedQuestions.length} perguntas inseridas.`)
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed falhou:', err)
  process.exit(1)
})
