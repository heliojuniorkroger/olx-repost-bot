import puppeteer from 'puppeteer';

type Product = {
    title: string;
    description: string;
    category: string;
    subcategory: string;
    price: number;
};

const products: Array<Product> = [
    {
        title: 'Nintendo Switch Cinza 32gb em Perfeito Estado',
        description:
            'Console usado pouquissimas vezes, tem um ano que eu comprei. Está novinho, não tem drift e não tem arranhões.\n\nNão aceito trocas',
        category: 'Eletrônicos e celulares',
        subcategory: 'Videogames',
        price: 2300,
    },
];

class Browser {
    private static instance: puppeteer.Browser;
    public static page: puppeteer.Page;

    public static async launch() {
        this.instance = await puppeteer.launch({
            headless: false,
        });
    }

    public static async getPage() {
        if (this.page) return this.page;
        this.page = await this.instance.newPage();
        await this.page.setViewport({ width: 1366, height: 768 });
        return this.page;
    }
}

class OLXService {
    public static async login() {
        const page: puppeteer.Page = await Browser.getPage();

        await page.goto('https://conta.olx.com.br/acesso');

        await page.type('input[type="email"]', 'heliojuniorkroger@gmail.com');
        await page.type('input[type="password"]', 'Abs!3006');

        await page.evaluate(() => {
            const buttons: Array<HTMLButtonElement> = Array.from(
                document.querySelectorAll('button[type="text"]')
            );
            const submitButton = buttons.find(
                (button) => button.textContent === 'Entrar'
            );
            submitButton.click();
        });

        await page.waitForNavigation();
    }

    private static async removeProductIfExists(product: Product) {
        const page: puppeteer.Page = await Browser.getPage();

        await page.goto('https://conta.olx.com.br/anuncios/publicados');

        await page.evaluate((product: Product) => {
            const existentProduct: Element = Array.from(
                document.querySelectorAll('.sc-sPYgB.dgAZRt')
            ).find((pageProduct: HTMLElement) => {
                const productLink: HTMLElement = pageProduct.querySelector('a');
                return productLink.textContent === product.title;
            });

            if (existentProduct) {
                const deleteButton: Element = Array.from(
                    (<HTMLElement>existentProduct).querySelectorAll(
                        'button[type="button"]'
                    )
                ).find(
                    (button: HTMLElement) => button.textContent === 'Excluir'
                );
                (<HTMLButtonElement>deleteButton).click();
                // (<HTMLElement>(
                //     document.querySelector('[value="not_sold"')
                // )).click();

                // const confirmButton: Element = Array.from(
                //     document
                //         .querySelector('.ReactModal__Content')
                //         .querySelectorAll('button[type="text"]')
                // ).find((button: HTMLElement) => {
                //     return button.textContent === 'Excluir';
                // });
                // (<HTMLButtonElement>confirmButton).click();
            }
        }, product);
    }

    public static async publish() {
        const page: puppeteer.Page = await Browser.getPage();

        const product: Product = products[0];

        await this.removeProductIfExists(product);

        // await page.goto('https://www2.olx.com.br/ai/form');
        // await page.type('#input_subject', product.title);
        // await page.type('#input_body', product.description);

        // await page.evaluate((product: Product) => {
        //     const categoriesList: HTMLElement = document.querySelector(
        //         '.category-container__category'
        //     );
        //     const category: Element = Array.from(categoriesList.children).find(
        //         (category: HTMLElement) => {
        //             const link: HTMLElement = category.querySelector('a');
        //             return link.getAttribute('title') === product.category;
        //         }
        //     );
        //     (<HTMLElement>category).click();

        //     const subcategoriesList: HTMLElement = category.querySelector(
        //         '.category-container__subcategory'
        //     );
        //     const subcategoryLink: Element = Array.from(
        //         subcategoriesList.children
        //     ).find((subcategory: HTMLElement) => {
        //         const link: HTMLElement = subcategory.querySelector('a');
        //         return link.getAttribute('title') === product.subcategory;
        //     });
        //     (<HTMLLinkElement>subcategoryLink).click();
        // }, product);

        // // videogame only
        // await page.waitForSelector('[name="videogame_type"]');
        // await page.select('[name="videogame_type"]', '1'); // console
        // await page.select('[name="videogame_model"]', '14'); // others

        // await page.type('[name="price"]', String(product.price));
        // await page.type('[name="zipcode"]', '30310530');
    }
}

(async () => {
    await Browser.launch();
    await OLXService.login();
    await OLXService.publish();
})();
