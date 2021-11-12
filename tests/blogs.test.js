const Page = require('./helpers/page');

let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
});

afterEach(async () => {
    await page.close();
});

describe('When logged in', async () => {
    const post_title = 'New Blog Post';
    const post_content = 'This is some interesting text.'
    beforeEach(async () => {
        await page.login();
        await page.click('a.btn-floating');
    });
    test('Can see blog create form', async() => {
        const label = await page.getContents('form label');
        expect(label).toEqual('Blog Title');
    });
    describe('And using valid inputs', async () => {
        beforeEach(async () => {
            await page.type('.title input', post_title);
            await page.type('.content input', post_content);
            await page.click('form button');
        });
        test('submit takes user to review', async () => {
            const text = await page.getContents('h5');
            expect(text).toEqual('Please confirm your entries');
        });
        test('submit then save adds blog to index', async () => {
            await page.click('button.green');
            await page.waitFor('.card');
            const title = await page.getContents('.card-title');
            const content = await page.getContents('p');
            expect(title).toEqual(post_title);
            expect(content).toEqual(post_content);
        });
    });
    describe('And using invalid inputs', async () => {
        beforeEach(async () => {
            await page.click('form button');
        });
        test('form shows error message', async () => {
            error_message = 'You must provide a value'
            title_error = await page.getContents('.title .red-text');
            content_error = await page.getContents('.content .red-text');
            expect(title_error).toEqual(error_message);
            expect(content_error).toEqual(error_message);
        });
    })
});

describe('When not logged in', async () => {
    const actions = [
        {
            method: 'get',
            route: '/api/blogs'
        },
        {
            method: 'post',
            route: '/api/blogs',
            data: {title: 'Test', content: 'Test Content'}
        }
    ];
    test('Blog actions are prohibited', async () => {
        const results = await page.execRequests(actions);
        results.forEach(result => {
            expect(result).toHaveProperty('error');
        })
    });
});