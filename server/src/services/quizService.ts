export function sanitizeQuiz(quiz) {
  return {
    ...quiz.toObject(),
    questions: quiz.questions.map(({ _id, question, options, points }) => ({ _id, question, options, points }))
  };
}

export function gradeQuizAttempt(quiz, answers = []) {
  let pointsEarned = 0;
  let correctAnswers = 0;
  const totalPoints = quiz.questions.reduce((sum, question) => sum + question.points, 0);

  const normalizedAnswers = quiz.questions.map((question) => {
    const found = answers.find((item) => item.question?.toString() === question._id.toString());
    const answer = Number(found?.answer);
    const isCorrect = answer === question.correctAnswer;

    if (isCorrect) {
      pointsEarned += question.points;
      correctAnswers += 1;
    }

    return { question: question._id, answer };
  });

  const score = totalPoints ? Math.round((pointsEarned / totalPoints) * 100) : 0;

  return {
    answers: normalizedAnswers,
    score,
    correctAnswers,
    incorrectAnswers: quiz.questions.length - correctAnswers,
    passed: score >= quiz.passingScore
  };
}
