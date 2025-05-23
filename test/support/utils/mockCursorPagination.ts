export function mockCursorPagination<T extends { id: number; createdAt: string }>(
  endpoint: string,
  dummyData: T[],
  alias: string,
) {
  cy.intercept('GET', `${Cypress.env('API_URL')}${endpoint}*`, (req) => {
    const url = new URL(req.url);
    const cursorId = parseInt(url.searchParams.get('cursorId') || '');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    let startIndex = 0;
    if (!isNaN(cursorId)) {
      startIndex = dummyData.findIndex(item => item.id === cursorId) + 1;
    }

    const pagedItems = dummyData.slice(startIndex, startIndex + limit);
    const lastItem = pagedItems[pagedItems.length - 1];
    const hasNext = startIndex + limit < dummyData.length;

    req.reply({
      statusCode: 200,
      body: {
        data: {
          items: pagedItems,
          nextCursorId: lastItem?.id ?? null,
          nextCursorStandard: lastItem?.createdAt ?? null,
          hasNext
        },
      },
    });
  }).as(alias);
}
