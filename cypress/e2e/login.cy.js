describe('Tela de Login', () => {
  it('Deve fazer login com email e senha corretos', () => {
    cy.visit('http://127.0.0.1:5500/index.html')
    cy.get('#email').type('adm@empresa.com')
    cy.get('#matricula').type('246810')
    cy.get('#senha').type('Adm@2468')
    cy.get('form').submit()
    cy.url().should('active ', '../html/dashboard.html') // ajuste conforme sua estrutura
  })
})
