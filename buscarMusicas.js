function removeAcentos(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function search() {
    const query = removeAcentos($("#searchInput").val().toLowerCase().trim());
    const sheetID = '15GBCT0HKO5qUloXg-LPR4gRd4JpDQpf_qxHW5Ob4CnY';
    const apiKey = 'AIzaSyAc1AvFjueKSY6yTiOv6g6-dJY7a05urLk';
    const sheetName = 'REPERTORIOS';

    if (query === "") {
        $("#results").html('<p class="se" style="color: red;">Por favor, insira uma palavra-chave válida para a busca.</p>');
        return;
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}?key=${apiKey}`;
    
    $.getJSON(url).then(function(data) {
        const rows = data.values;

        if (!rows || rows.length === 0) {
            console.log("Nenhum dado encontrado");
            return;
        }

        const escapedQuery = escapeRegExp(query);
        const regex = new RegExp(`(^|\\s)${escapedQuery}(?=\\s|$)`, "i");

        // Remove o cabeçalho
        const contentRows = rows.slice(1);

        const results = contentRows.filter(row =>
            regex.test(removeAcentos((row[1] || "").toLowerCase()))
        );

        if (results.length === 0) {
            $("#results").html('<p class="se" style="color: red;">Nenhum resultado encontrado. Tente outra busca.</p>');
        } else {
            let html = '<table><thead><tr><th>Quem ministra</th><th>Música</th><th>Cantor/Banda/Versão</th><th>Tom Original</th><th>Tom Adaptado</th><th>Observações</th><th>Link YouTube</th></tr></thead><tbody>';
            results.forEach(row => {
                html += `<tr>
                    <td>${row[0] || ""}</td>
                    <td>${row[1] || ""}</td>
                    <td>${row[2] || ""}</td>
                    <td>${row[3] || ""}</td>
                    <td>${row[4] || ""}</td>
                    <td>${row[5] || ""}</td>
                    <td>${row[6] ? `<a href="${row[6]}" target="_blank">🔗</a>` : ""}</td>
                </tr>`;
            });
            html += '</tbody></table>';
            $("#results").html(html);
        }
    }).catch(function(error) {
        console.error("Erro ao buscar dados: ", error);
        $("#results").html('<p class="se" style="color: red;">Erro ao buscar dados. Tente novamente mais tarde.</p>');
    });
}

// Código do modal e eventos permanece igual
$(document).ready(function() {
    $("#searchInput").on("keypress", function(event) {
        if (event.which === 13) {
            event.preventDefault();
            search();
        }
    });

    $("#ministersModal").hide();

    $("#openMinistersModal").click(function() {
        $("#ministersModal").fadeIn();
    });

    $(".close").click(function() {
        $("#ministersModal").fadeOut();
    });

    $(window).click(function(event) {
        if (event.target.id === "ministersModal") {
            $("#ministersModal").fadeOut();
        }
    });
});

window.onload = function() {
    document.getElementById("searchInput").value = "";
};
