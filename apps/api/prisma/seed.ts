import argon2 from 'argon2';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await argon2.hash('aquarela123');
  const user = await prisma.user.upsert({
    where: { email: 'ana@aquarela.local' },
    update: {},
    create: {
      name: 'Ana',
      email: 'ana@aquarela.local',
      passwordHash,
      termsAcceptedAt: new Date(),
    },
  });

  const profile = await prisma.careProfile.upsert({
    where: { id: 'demo-profile-lucia' },
    update: {},
    create: {
      id: 'demo-profile-lucia',
      name: 'Lúcia Silva',
      nickname: 'Dona Lúcia',
      age: 82,
      city: 'São Paulo, SP',
      favoriteSubjects: ['Jardinagem', 'Receitas de família', 'Costura', 'Viagens de trem'],
      favoriteSongs: ['Chico Buarque - Apesar de você', 'Roberto Carlos - Como é grande o meu amor por você'],
      sensitiveTopics: ['Hospital', 'Falecimentos recentes', 'Questões financeiras ou herança'],
    },
  });

  await prisma.familyMembership.upsert({
    where: { userId_profileId: { userId: user.id, profileId: profile.id } },
    update: { role: 'owner' },
    create: { userId: user.id, profileId: profile.id, role: 'owner' },
  });

  const ana = await prisma.importantPerson.upsert({
    where: { id: 'demo-person-ana' },
    update: {},
    create: {
      id: 'demo-person-ana',
      profileId: profile.id,
      name: 'Ana',
      relation: 'Filha',
      description: 'Filha mais velha de Dona Lúcia.',
      supportPhrase: 'Mãe, a Ana te ama muito.',
      stories: ['Costumava cozinhar com Dona Lúcia aos domingos.'],
      sharedMoments: ['Viagem para Ubatuba', 'Almoço de domingo'],
      lastInteraction: 'Ligou ontem à tarde',
      scannerConsent: true,
    },
  });

  const joao = await prisma.importantPerson.upsert({
    where: { id: 'demo-person-joao' },
    update: {},
    create: {
      id: 'demo-person-joao',
      profileId: profile.id,
      name: 'João',
      relation: 'Filho',
      description: 'Filho de Dona Lúcia.',
      stories: ['Toca violão nas reuniões familiares.'],
      sharedMoments: ['Almoço de domingo'],
      lastInteraction: 'Visitou no fim de semana',
      scannerConsent: true,
    },
  });

  const memoryCount = await prisma.memory.count({ where: { profileId: profile.id } });
  if (memoryCount === 0) {
    const memories = await Promise.all([
      prisma.memory.create({
        data: {
          profileId: profile.id,
          title: 'Viagem para Ubatuba',
          period: 'Verão de 1998',
          story: 'Essa foi a primeira viagem da família para Ubatuba. Dona Lúcia gostava de caminhar na praia pela manhã e comer pastel no fim da tarde.',
          category: 'viagens',
          suggestedPhrase: 'Vó, essa foi aquela viagem para Ubatuba em que vocês caminhavam na praia.',
          previousReaction: 'Sorriu e ficou tranquila.',
          isFavorite: true,
          people: { create: [{ personId: ana.id }, { personId: joao.id }] },
        },
      }),
      prisma.memory.create({
        data: {
          profileId: profile.id,
          title: 'Almoço de domingo',
          period: 'Tradição de família',
          story: 'Macarronada aos domingos com toda a família reunida.',
          category: 'familia',
          suggestedPhrase: 'Ninguém faz uma macarronada como a da senhora.',
          previousReaction: 'Ficou conversando sobre a receita.',
          isFavorite: true,
          people: { create: [{ personId: ana.id }] },
        },
      }),
    ]);

    await prisma.diaryEntry.create({
      data: {
        profileId: profile.id,
        authorId: user.id,
        mood: 'Tranquila',
        sleep: 'Dormiu bem',
        food: 'Tomou café completo',
        energy: 'Disposta pela manhã',
        interaction: 'Boa, conversou bastante',
        socialInteraction: 'Falou com a filha',
        orientation: 'Orientada na maior parte do tempo',
        recognition: 'Reconheceu todos',
        observation: 'Tarde super agradável.',
      },
    });

    await prisma.visit.create({
      data: {
        profileId: profile.id,
        visitorId: user.id,
        generatedSmile: true,
        generatedConversation: true,
        observation: 'Gostou muito de ver as fotos antigas.',
        roadmap: { suggestedMemories: memories.map(memory => memory.id) },
      },
    });

    await prisma.legacyEntry.create({
      data: {
        profileId: profile.id,
        question: 'Qual conselho você gostaria de deixar para a família?',
        answer: 'Cuidem uns dos outros e nunca deixem o almoço de domingo acabar.',
        type: 'texto',
      },
    });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async error => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
