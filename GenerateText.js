// ==UserScript==
// @name         formatTodoListScript
// @namespace    http://tampermonkey.net/
// @version      1
// @description  用来抓去页面table的row并生成自己想要的文本格式
// @author       pengpengzx
// @match        需要启用的地址
// @icon         https://www.google.com/s2/favicons?domain=backlog.com
// @grant        none
// ==/UserScript==
(function() {
  'use strict';
  // Your code here...
  window.onload = function() {
    const location = window.location.origin;
    const todoDoms = document.getElementById('myIssueContent')
      .getElementsByTagName('table')[0]
      .getElementsByTagName('tbody')[0]
      .querySelectorAll('tr');
    const Wraper = document.getElementById('myIssueContent');

    // 生成按钮组
    const confirmBtn = document.createElement('button');
    const resetBtn = document.createElement('button');
    const copyBtn = document.createElement('button');

    confirmBtn.innerText = '生成文本';
    resetBtn.innerText = '重置';
    copyBtn.innerText = '复制文字';

    const displayText = document.createElement('div');
    displayText.setAttribute('contenteditable', true)
    const fragment = new DocumentFragment();


    const text = Array.from(todoDoms).map((dom, index) => {
      const todoId = dom.getElementsByClassName('js-issue-key')[0].getElementsByTagName('a')[0];
      let todo = dom.getElementsByClassName('js-issue-title')[0].getElementsByClassName('copyData')[0].innerText;
      const href = todoId.getAttribute('href');
      const url = location + href;
      const todoTitle = `* [${todoId.innerText}](${url})`;
      const inputs = createInput(todo, index);

      todo = todo.replace(todoId.innerText, todoTitle);
      fragment.appendChild(inputs);
      return todo
    });

    fragment.appendChild(confirmBtn);
    fragment.appendChild(resetBtn);
    fragment.appendChild(copyBtn);

    Wraper.appendChild(fragment);
    Wraper.appendChild(displayText);

    // Bind event
    // 生成文本
    confirmBtn.onclick = function() {
      let result = text.map((el, index) => {
        const rows = document.getElementsByClassName('input-row')[index];
        const inputs = rows.getElementsByTagName('input');
        return `${el}${inputs[0].value}% -> ${inputs[0].value}%`;
      })
      result = ['【テレワーク報告】',
        '今日の仕事内容：',
        ...result
      ]
      displayText.innerText = result.join('\n');
    }


    // 复制
    copyBtn.onclick = function() {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(displayText.innerText);
      }
    }

    // 重置
    resetBtn.onclick = function() {
      const inputs = Wraper.getElementsByTagName('input');
      inputs.forEach(el => el.value = null);
      displayText.innerText = '';
    }

    function setAttr(dom, attrObj) {
      const attrKeys = Object.keys(attrObj);
      attrKeys.forEach(attr => {
        dom.setAttribute(attr, attrObj[attr] + '')
      })
    }

    // 创建row
    function createInput(data) {
      const inputStart = document.createElement('input');
      const inputEnd = document.createElement('input');
      const textWraper = document.createElement('span');
      const inputWraper = document.createElement('div');

      inputStart.style.margin = '5px';
      textWraper.innerText = data;
      inputWraper.className = 'input-row'

      setAttr(inputStart, {
        'id': 'inputStart',
        'placeholder': 'start',
        'type': 'text',
        'size': 6,
        'maxlength': 2,
      })
      setAttr(inputEnd, {
        'id': 'inputStart',
        'type': 'text',
        'placeholder': 'end',
        'size': 6,
        'maxlength': 3,
      })

      inputWraper.appendChild(textWraper);
      inputWraper.appendChild(inputStart)
      inputWraper.appendChild(inputEnd);
      return inputWraper;
    }
  }
})();
