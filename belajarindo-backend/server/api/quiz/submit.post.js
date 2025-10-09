import { prisma } from '../../utils/prisma.js';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { quizType, score, totalQuestions, correctAnswers, answers, timeSpent } = body || {};
    const user = event.context.user;
    const userId = user && (user.sub || user.userId || user.id);

    if (!userId) { setResponseStatus(event, 401); return { error: 'Not authenticated' }; }

    const result = await prisma.quizResult.create({
      data: {
        userId,
        quizCategory: quizType,
        score,
        totalQuestions,
        correctAnswers,
        answers,
        timeSpent
      }
    });

    return { success: true, result };
  } catch (error) {
    console.error(error);
    setResponseStatus(event, 500);
    return { error: 'Failed to save quiz result' };
  }
});
