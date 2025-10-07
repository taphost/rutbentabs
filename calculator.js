(function() {
    'use strict';

    // Costanti per "numeri magici" e configurazione
    const ANNO_INIZIALE = 1551;
    const CICLO_TAVOLE = 19;
    const SOMMA_FISSA = 9;

    // Elementi del DOM
    let annoInput, meseSelect, giornoInput, usaGiulianoCheckbox, calcolaBtn, resultsSection, errorContainer;

    /**
     * Funzione principale che si avvia al caricamento del DOM.
     */
    function init() {
        // Centralizzazione della selezione degli elementi del DOM
        annoInput = document.getElementById('anno');
        meseSelect = document.getElementById('mese');
        giornoInput = document.getElementById('giorno-estrazione');
        usaGiulianoCheckbox = document.getElementById('usa-giuliano');
        calcolaBtn = document.getElementById('calcola-btn');
        resultsSection = document.getElementById('results');
        errorContainer = document.getElementById('error-container');

        impostaDataCorrente();
        aggiungiEventListener();
    }

    /**
     * Aggiunge tutti gli event listener necessari.
     */
    function aggiungiEventListener() {
        calcolaBtn.addEventListener('click', calcolaNumeri);
        
        const formattaGiornoHandler = (e) => {
            let value = parseInt(e.target.value, 10);
            if (isNaN(value) || value < 1) {
                e.target.value = '01';
            } else if (value < 10) {
                e.target.value = String(value).padStart(2, '0');
            }
        };
        giornoInput.addEventListener('change', formattaGiornoHandler);
        giornoInput.addEventListener('blur', formattaGiornoHandler);

        [meseSelect, annoInput].forEach(element => {
            element.addEventListener('change', validaGiornoInBaseAMeseAnno);
        });
    }

    /**
     * Calcola la tavola corretta in base all'anno.
     * @param {number} anno - L'anno per cui calcolare la tavola.
     * @returns {number} Il numero della tavola (da 1 a 19).
     */
    function calcolaTavolaCorrente(anno) {
        const differenzaAnni = anno - ANNO_INIZIALE;
        const resto = differenzaAnni % CICLO_TAVOLE;
        return resto === 0 ? CICLO_TAVOLE : resto;
    }

    /**
     * Applica la regola "fuori 90".
     * @param {number} numero - Il numero da elaborare.
     * @returns {number} Il numero dopo aver applicato la regola.
     */
    function applicaFuori90(numero) {
        if (numero <= 90) return numero;
        if (numero <= 99) return numero - 90;
        return Math.floor(numero / 10);
    }

    function isBisestile(anno) {
        return (anno % 4 === 0 && anno % 100 !== 0) || (anno % 400 === 0);
    }

    function giorniInMese(mese, anno) {
        const giorniPerMese = {
            1: 31, 2: isBisestile(anno) ? 29 : 28, 3: 31, 4: 30, 5: 31, 6: 30,
            7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31
        };
        return giorniPerMese[mese];
    }

    function getGiornoSettimana(giorno, mese, anno) {
        const nomiGiorni = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
        const data = new Date(anno, mese - 1, giorno);
        return nomiGiorni[data.getDay()];
    }

    function formattaData(giorno, mese, anno) {
        const g = String(giorno).padStart(2, '0');
        const m = String(mese).padStart(2, '0');
        return `${g}/${m}/${anno}`;
    }

    /**
     * Mostra o nasconde un messaggio di errore nell'interfaccia.
     * @param {string} messaggio - Il messaggio da mostrare. Se vuoto, nasconde il contenitore.
     */
    function mostraErrore(messaggio) {
        if (messaggio) {
            errorContainer.textContent = messaggio;
            errorContainer.style.display = 'block';
        } else {
            errorContainer.textContent = '';
            errorContainer.style.display = 'none';
        }
    }

    /**
     * Valida l'input dell'utente.
     * @returns {object|null} Un oggetto con i valori validati o null se la validazione fallisce.
     */
    function validaInput() {
        mostraErrore(''); // Pulisce errori precedenti
        const anno = parseInt(annoInput.value, 10);
        const mese = parseInt(meseSelect.value, 10);
        const giorno = parseInt(giornoInput.value, 10);

        if (!anno || !mese || !giorno) {
            mostraErrore('Compila tutti i campi della data!');
            return null;
        }

        const maxGiorni = giorniInMese(mese, anno);
        if (giorno < 1 || giorno > maxGiorni) {
            mostraErrore(`Il giorno deve essere compreso tra 1 e ${maxGiorni} per ${NOMI_MESI[mese]} ${anno}!`);
            return null;
        }

        return { anno, mese, giorno };
    }

    /**
     * Converte una data gregoriana in giuliana.
     */
    function convertiGregorianToGiuliano(giorno, mese, anno) {
        let differenzaGiorni;
        if (anno >= 2500 && anno <= 2599) differenzaGiorni = 17;
        else if (anno >= 2400 && anno <= 2499) differenzaGiorni = 16;
        else if (anno >= 2300 && anno <= 2399) differenzaGiorni = 16;
        else if (anno >= 2200 && anno <= 2299) differenzaGiorni = 15;
        else if (anno >= 2100 && anno <= 2199) differenzaGiorni = 14;
        else if (anno >= 1900 && anno <= 2099) differenzaGiorni = 13;
        else if (anno >= 1800 && anno < 1900) differenzaGiorni = 12;
        else if (anno >= 1700 && anno < 1800) differenzaGiorni = 11;
        else if (anno >= 1583 && anno < 1700) differenzaGiorni = 10;
        else differenzaGiorni = 13;

        const dataGreg = new Date(anno, mese - 1, giorno);
        dataGreg.setDate(dataGreg.getDate() - differenzaGiorni);

        return {
            giorno: dataGreg.getDate(),
            mese: dataGreg.getMonth() + 1,
            anno: dataGreg.getFullYear(),
            differenzaGiorni: differenzaGiorni
        };
    }

    /**
     * Funzione principale che esegue il calcolo.
     */
    function calcolaNumeri() {
        const datiInput = validaInput();
        if (!datiInput) return;

        let { anno, mese, giorno } = datiInput;
        let datiConversione = null;

        if (usaGiulianoCheckbox.checked) {
            datiConversione = convertiGregorianToGiuliano(giorno, mese, anno);
            anno = datiConversione.anno;
            mese = datiConversione.mese;
            giorno = datiConversione.giorno;
        }

        const tavolaCorrente = calcolaTavolaCorrente(anno);
        const numeriBase = TAVOLE_RUTILIO[tavolaCorrente] ? TAVOLE_RUTILIO[tavolaCorrente][mese] : null;

        if (!numeriBase) {
            mostraErrore('Errore: dati non disponibili per la tavola o il mese selezionato.');
            return;
        }

        const sommaDaAggiungere = SOMMA_FISSA + giorno;
        const numeriCalcolati = numeriBase.map(numero => numero + sommaDaAggiungere);
        const numeriFinali = numeriCalcolati.map(applicaFuori90);

        mostraRisultati({
            datiInput,
            tavolaCorrente,
            numeriBase,
            sommaDaAggiungere,
            numeriCalcolati,
            numeriFinali,
            datiConversione,
            annoCalcolo: anno,
            meseCalcolo: mese,
            giornoCalcolo: giorno
        });
    }

    function creaHTMLNumeri(numeri) {
        return numeri.map(num => `<div class="number-box">${num}</div>`).join('');
    }

    function creaHTMLCalcoli(numeriBase, sommaDaAggiungere, numeriCalcolati, numeriFinali) {
        return numeriBase.map((base, index) => {
            const calcolato = numeriCalcolati[index];
            const finale = numeriFinali[index];
            const fuori90 = calcolato > 90 ? ` → ${finale} (fuori 90)` : '';
            return `${base} + ${sommaDaAggiungere} = ${calcolato}${fuori90}`;
        }).join(', ');
    }

    function mostraRisultati(dati) {
        const { datiInput, tavolaCorrente, numeriBase, sommaDaAggiungere, numeriCalcolati, numeriFinali,
                datiConversione, annoCalcolo, meseCalcolo, giornoCalcolo } = dati;

        const giornoSettimana = getGiornoSettimana(datiInput.giorno, datiInput.mese, datiInput.anno);
        const dataFormattata = formattaData(datiInput.giorno, datiInput.mese, datiInput.anno);
        const restoCalcolo = (annoCalcolo - ANNO_INIZIALE) % CICLO_TAVOLE;
        const restoTesto = restoCalcolo === 0 ? `zero (Tavola ${CICLO_TAVOLE})` : restoCalcolo;

        document.getElementById('result-header').textContent = `Numeri Calcolati per ${giornoSettimana} ${datiInput.giorno} ${NOMI_MESI[datiInput.mese]} ${datiInput.anno}`;
        document.getElementById('result-tavola').textContent = `Utilizzando la Tavola ${tavolaCorrente} di Rutilio Benincasa`;
        document.getElementById('result-giorno-gregorian').textContent = `Giorno dell'estrazione (Gregoriano): ${dataFormattata}`;

        const infoCalendarioContainer = document.getElementById('result-info-calendario');
        if (datiConversione) {
            const dataGiulianaFormattata = formattaData(datiConversione.giorno, datiConversione.mese, datiConversione.anno);
            infoCalendarioContainer.innerHTML = `
                <p style="margin-top: 10px; background: #fef9e7; padding: 10px; border: 3px solid #282828;">
                    <strong>Calcolo Giuliano:</strong> ${dataFormattata} → <strong>${dataGiulianaFormattata}</strong> (-${datiConversione.differenzaGiorni} giorni)
                </p>`;
        } else {
            infoCalendarioContainer.innerHTML = '';
        }

        document.getElementById('result-numbers').innerHTML = creaHTMLNumeri(numeriFinali);
        document.getElementById('result-step-1').innerHTML = `<strong>Anno considerato:</strong> ${annoCalcolo} → Tavola ${tavolaCorrente}`;
        document.getElementById('result-step-2').innerHTML = `<strong>Formula tavola:</strong> (${annoCalcolo} - ${ANNO_INIZIALE}) ÷ ${CICLO_TAVOLE} = resto ${restoTesto}`;
        document.getElementById('result-step-3').innerHTML = `<strong>Mese corrente:</strong> ${NOMI_MESI[meseCalcolo]} → numeri base: [${numeriBase.join(', ')}]`;
        document.getElementById('result-step-4').innerHTML = `<strong>Giorno dell'estrazione:</strong> ${giornoCalcolo}`;
        document.getElementById('result-step-5').innerHTML = `<strong>Formula calcolo:</strong> Numero base + ${SOMMA_FISSA} + ${giornoCalcolo} = Numero base + ${sommaDaAggiungere}`;
        document.getElementById('result-step-6').innerHTML = `<strong>Calcoli effettuati:</strong> ${creaHTMLCalcoli(numeriBase, sommaDaAggiungere, numeriCalcolati, numeriFinali)}`;
        document.getElementById('result-step-7').innerHTML = `<strong>Risultato finale:</strong> [${numeriFinali.join(', ')}]`;

        // Mostra le sezioni dei risultati
        document.querySelector('.tavola-info').style.display = 'block';
        document.querySelector('.result-card').style.display = 'block';
        document.querySelector('.calculation-steps').style.display = 'block';
        document.getElementById('result-info-box').style.display = 'block';

        resultsSection.classList.add('show');
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Stima l'altezza della pagina dopo il calcolo
        setTimeout(() => {
            console.log(`Altezza della pagina dopo il calcolo: ${document.body.scrollHeight}px`);
        }, 100); // Leggero ritardo per assicurarsi che il rendering sia completo
    }

    function impostaDataCorrente() {
        const oggi = new Date();
        annoInput.value = oggi.getFullYear();
        meseSelect.value = oggi.getMonth() + 1;
        giornoInput.value = String(oggi.getDate()).padStart(2, '0');
    }

    function validaGiornoInBaseAMeseAnno() {
        const anno = parseInt(annoInput.value, 10);
        const mese = parseInt(meseSelect.value, 10);
        const giorno = parseInt(giornoInput.value, 10);

        if (anno && mese && giorno) {
            const maxGiorni = giorniInMese(mese, anno);
            if (giorno > maxGiorni) {
                giornoInput.value = String(maxGiorni).padStart(2, '0');
            }
        }
    }

    // Avvia lo script quando il DOM è pronto
    document.addEventListener('DOMContentLoaded', () => {
        init();
        // Stima l'altezza iniziale della pagina
        console.log(`Altezza iniziale della pagina: ${document.body.scrollHeight}px`);
    });

})();
