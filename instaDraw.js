const puppeteer = require('puppeteer');
const ora = require('ora');
const cheerio = require('cheerio');


const loadMoreComments = `#react-root > section > main > div > div > article > div.eo2As > div.KlCQn.EtaWk > ul > li.lnrre > button`;
let commentsArray = [];

const loadAllComments = async (page) => {
    if (await page.$(loadMoreComments)) {
        await page.waitFor(200);
        await page.click(loadMoreComments);
        await loadAllComments(page);
    }
    return
}

(async () => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setViewport({ width: 1080, height: 720 });
    await page.goto('https://www.instagram.com/p/BvJ0MKSBUqI/');

    const spinner = ora('Carregando...').start();
    
    await page.screenshot({ path: 'screenshot.png' });
    await page.waitFor(1000);
    


    await loadAllComments(page);

    let bodyHTML = await page.evaluate(() => document.body.innerHTML);

    const $ = await cheerio.load(bodyHTML);
    

    await $('.k59kT li')
        .each((i, el) => {
            if (i > 0) {
                let comment = $(el)
                    .find('.C4VMK span')
                    .text();
                let nameAuthor = $(el)
                    .find('.C4VMK h3 a')
                    .text();

                let author = `@${nameAuthor}`
                let commentObject = {
                    author: author,
                    comment: comment
                }
                commentsArray.push(commentObject);
            }
        });



    commentsArray.map((item, i) => {
        console.log('[Message: ] - ', item.comment);
        console.log('\n[Author] - ', item.author, '\n\n\n');
    });

    spinner.succeed('Comentários carregados com sucesso!');

    const randomNumber = Math.floor((Math.random() * (commentsArray.length + 1)));

    console.log('\n\n\n\n\n\n ----- Comentário Sorteado ----- \n\n\n\n');
    console.log('\nPessoa sorteada: ', commentsArray[randomNumber].author, '\n\n');
    console.log('Mensagem do comentário: ', commentsArray[randomNumber].comment, '\n\n')


    await page.screenshot({ path: 'screenshot2.png' });


    await browser.close();

})();