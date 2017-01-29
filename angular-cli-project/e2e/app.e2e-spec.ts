import { AngularCliProjectPage } from './app.po';

describe('angular-cli-project App', function() {
  let page: AngularCliProjectPage;

  beforeEach(() => {
    page = new AngularCliProjectPage();
  });

  it('should display title in the navbar', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('FullTeaching');
  });
});
