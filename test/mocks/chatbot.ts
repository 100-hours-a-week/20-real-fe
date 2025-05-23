export function mockPostChatbot(delay = 0) {
  cy.intercept('POST', `${Cypress.env('API_URL')}/v1/chatbots`, (req) => {
    const question = req.body.question;

    req.reply({
      delay,
      statusCode: 200,
      body: {
        data: {
          answer: `${question}에 대한 답변입니다.`,
        }
      }
    })
  }).as('POST-Chatbots')
}
