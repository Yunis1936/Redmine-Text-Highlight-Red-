// ==UserScript==
// @name         Redmine Text Highlight (Red)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Добавляет кнопку для окрашивания текста в красный цвет в редакторе задач и комментариев Redmine.
// @author       Ты
// @match        https://redmine.lachestry.tech/*
// @match        https://redmine.rigla.ru/*
// @icon         https://www.redmine.org/favicon.ico
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function addColorRedButton(toolbar, textarea) {
        if (!toolbar || !textarea) {
            return;
        }

        // Проверка на наличие кнопки, чтобы не дублировать
        if (toolbar.querySelector('.jstb_color_red')) {
            return;
        }

        const colorRedButton = document.createElement('button');
        colorRedButton.type = 'button';
        colorRedButton.className = 'jstb_color_red';
        colorRedButton.title = 'Выделить красным';

        // Стили кнопки
        Object.assign(colorRedButton.style, {
            marginRight: '2px',
            width: '24px',
            height: '24px',
            padding: '0',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: '#ddd',
            backgroundColor: 'transparent',
            backgroundImage: 'url("https://sotni.ru/wp-content/uploads/2023/08/krasnymi-bukvami-6.webp")', // URL иконки кнопки
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            cursor: 'pointer',
            opacity: '1',
        });

        // Логика кнопки
        colorRedButton.addEventListener('click', function () {
            const selectionStart = textarea.selectionStart;
            const selectionEnd = textarea.selectionEnd;

            const selectedText = textarea.value.substring(selectionStart, selectionEnd).trim();
            if (!selectedText) {
                alert('Пожалуйста, выделите текст, чтобы сделать его красным.');
                return;
            }

            const wrappedText = `%{color:red}${selectedText}%`;

            textarea.value =
                textarea.value.substring(0, selectionStart) +
                wrappedText +
                textarea.value.substring(selectionEnd);

            textarea.setSelectionRange(
                selectionStart,
                selectionStart + wrappedText.length
            );
            textarea.focus();
        });

        toolbar.appendChild(colorRedButton);
    }

    function initColorRedButton() {
        const descriptionToolbar = document.querySelector('.jstElements');
        const descriptionTextarea = document.querySelector('#issue_description');
        if (descriptionToolbar && descriptionTextarea) {
            addColorRedButton(descriptionToolbar, descriptionTextarea);
        }

        const commentToolbar = document.querySelectorAll('.jstElements')[1];
        const commentTextarea = document.querySelector('#issue_notes');
        if (commentToolbar && commentTextarea) {
            addColorRedButton(commentToolbar, commentTextarea);
        }
    }

    // Наблюдатель за изменениями DOM
    const observer = new MutationObserver(initColorRedButton);
    observer.observe(document.body, { childList: true, subtree: true });
})();
