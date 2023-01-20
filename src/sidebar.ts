import browser, { Tabs } from "webextension-polyfill";

let list = document.getElementById("tabs");

async function listTabs() {
    let tabs = await browser.tabs.query({ currentWindow: true });
    for (let tab of tabs) {
        list?.append(getListItem((tab)));
    }
}

function getListItem(tab: Tabs.Tab): HTMLLIElement {
    let li = document.createElement("li");
    li.innerHTML = tab.title ?? tab.url ?? "";
    return li;
}

function onTabCreated(tab: Tabs.Tab) {
    list?.append(getListItem(tab));
}

browser.tabs.onCreated.addListener(onTabCreated);

listTabs();
