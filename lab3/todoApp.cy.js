/// <reference types="cypress" />

describe('To-Do List App — E2E Tests', () => {
  const baseUrl = 'http://localhost:5500/'; 

  beforeEach(() => {
    cy.visit(baseUrl);
    cy.clearLocalStorage();
  });

  // добавление задачи и перезагрузка страницы
  it('должен добавлять задачу и сохранять её после перезагрузки', () => {
    const taskName = 'Купить хлеб';
    const taskDate = '2025-11-10';

    cy.get('input[name="task"]').type(taskName);
    cy.get('input[name="date"]').type(taskDate);
    cy.get('.btn--add').click();

    cy.get('#tasks-container li.task')
      .should('have.length', 1)
      .first()
      .within(() => {
        cy.get('.task__name').should('have.text', taskName);
        cy.get('.task__date').should('contain', '10.11.2025');
      });

    cy.reload();
    cy.get('#tasks-container li.task .task__name').should('contain', taskName);
  });

  // подтверждение удаления всех задач

  it('удаляет все задачи при подтверждении', () => {

    ['A', 'B'].forEach(task => {
      cy.get('input[name="task"]').type(task);
      cy.get('.btn--add').click();
    });
    cy.get('#tasks-container li.task').should('have.length', 2);

    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(true);
    });

    cy.get('.btn--delete-all').click();

    cy.get('#tasks-container .task').should('have.length', 0);
    cy.get('#task-count').should('contain', '0');
    
    cy.get('.todo__empty').should('be.visible');
    cy.get('.todo__empty p').should('contain', "u don't have any tasks yet :(");

    cy.window().then((win) => {
      const tasks = JSON.parse(win.localStorage.getItem('tasks') || '[]');
      expect(tasks).to.have.length(0);
    });
  });


  it('не удаляет задачи, если пользоватль отменил', () => {

    ['A', 'B'].forEach(task => {
      cy.get('input[name="task"]').type(task);
      cy.get('.btn--add').click();
    });
    cy.get('#tasks-container li.task').should('have.length', 2);

    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(false);
    });

    cy.get('.btn--delete-all').click();

    cy.get('#tasks-container .task').should('have.length', 2);
    cy.get('#task-count').should('contain', '2');
    
    cy.get('.todo__empty').should('not.be.visible');

    cy.window().then((win) => {
      const tasks = JSON.parse(win.localStorage.getItem('tasks') || '[]');
      expect(tasks).to.have.length(2);
    });
  });

  // редактирование задачи 
  it('должен позволять редактировать задачу и сохранять изменения', () => {
    cy.get('input[name="task"]').type('Почитать книгу');
    cy.get('.btn--add').click();

    cy.get('.task__name').should('contain', 'Почитать книгу');

    cy.get('.btn--edit').click();

    cy.get('section.todo__edit').should('be.visible');

    cy.get('#edit-form input[type="text"]').clear().type('Почитать 2 главы');

    cy.get('.btn--save').click();

    cy.get('.task__name').should('contain', 'Почитать 2 главы');

    cy.get('section.todo__edit').should('not.be.visible');
  });

 // граничные случаи
  // а) пустой ввод или только пробелы
  it('не должен добавлять задачу при пустом вводе или только пробелах', () => {
    cy.get('input[name="task"]').clear().type('   ');
    cy.get('.btn--add').click();
    cy.get('#tasks-container li.task').should('have.length', 0);
  });

  // б) очень длинный текст
  it('должен корректно отображать и не ломать интерфейс при длинном тексте', () => {
    const longText = 'X'.repeat(1000);
    cy.get('input[name="task"]').type(longText);
    cy.get('.btn--add').click();

    cy.get('#tasks-container li.task')
      .should('have.length', 1)
      .and('be.visible')
      .within(() => {
        cy.get('.task__name')
          .should('contain', 'XXXXX')
          .invoke('text')
          .should('have.length.at.least', 100);
      });
  });

  // 3) разрешены дубликаты
  it('должен разрешать дублирующиеся задачи', () => {
    cy.get('input[name="task"]').type('Помыть посуду');
    cy.get('.btn--add').click();
    cy.get('input[name="task"]').type('Помыть посуду');
    cy.get('.btn--add').click();

    cy.get('#tasks-container li.task')
      .should('have.length', 2)
      .each($el => cy.wrap($el).contains('Помыть посуду'));
  });

  // 4) пустая дата — должна быть текущая
  it('при пустой дате автоматически должна проставляться текущая', () => {
    const today = new Date().toLocaleDateString('ru-RU');
    cy.get('input[name="task"]').type('Без даты');
    cy.get('.btn--add').click();

    cy.get('#tasks-container .task__date').should('contain', today);
  });

  // 5) редактирование с пустым именем — не сохраняем
  it('не должен сохранять пустое имя', () => {
    cy.get('input[name="task"]').type('Проверка пустого имени');
    cy.get('.btn--add').click();

    cy.get('.btn--edit').click();

    cy.get('section.todo__edit').should('be.visible');

    cy.get('#edit-form input[type="text"]').clear();

    cy.on('window:alert', (txt) => {
      expect(txt).to.contains('Название задачи не может быть пустым!');
    });

    cy.get('.btn--save').click();

    cy.get('section.todo__edit').should('be.visible');

    cy.get('.task__name').should('contain', 'Проверка пустого имени');
  });

});
