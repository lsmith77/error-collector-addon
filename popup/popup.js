/* Error Collector WebExtension
 * Copyright (C) 2017 Daniel Naber (http://www.danielnaber.de)
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301
 * USA
 */

//const apiEndpoint = "http://localhost:8000/submitErrorExample";
const apiEndpoint = "https://languagetoolplus.com/submitErrorExample";

function showText(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: 'getText'}, function(response) {
        document.getElementById("origText").value = response;
        document.getElementById("correctedText").value = response;
        document.getElementById("url").value = tabs[0].url;
        console.log("tabs", tabs);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    if (chrome && chrome.tabs) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            showText(tabs);
        });
    } else {
        console.log("no chrome && chrome.tabs");
    }
    document.getElementById("form").addEventListener('submit', function(e) {
        e.preventDefault();
        const req = new XMLHttpRequest();
        req.timeout = 60 * 1000; // milliseconds
        req.open('POST', apiEndpoint, true);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.onload = function() {
            if (req.status === 200) {
                self.close();
            } else {
                alert("Sorry, error submitting sentence. Code: " + req.status);
            }
        };
        req.onerror = function() {
            alert("Sorry, error submitting sentence to " + apiEndpoint);
        };
        req.ontimeout = function() {
            alert("Sorry, error submitting sentence to " + apiEndpoint);
        };
        req.onreadystatechange = function() {
            //console.log("onreadystatechange", req.status, req.readyState);
            if (req.readyState == XMLHttpRequest.DONE && req.status == 0) {
                // not sure why this sometimes on first click...
                self.close();
            }
        };
        req.send(
            "sentence=" + encodeURIComponent(document.getElementById("origText").value) +
            "&correction=" + encodeURIComponent(document.getElementById("correctedText").value) +
            "&url=" + encodeURIComponent(document.getElementById("url").value)
        );
        return false;
    });
});
