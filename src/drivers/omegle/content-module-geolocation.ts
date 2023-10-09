import {ControlsTabApi, ControlsTabMap, GeolocationModule} from "../chatruletka/content-module-geolocation";
import {ChatruletkaDriver} from "../content-driver-chatruletka";
import {OmegleDriver} from "../content-driver-omegle";

export class GeolocationModuleOmegle extends GeolocationModule {
    public mainDisclaimerKey = "main2"

    public constructor(driver: ChatruletkaDriver | OmegleDriver) {
        super(driver);

        document.unbindArrive("#reviewImageContainer")
        document.unbindArrive("#discordImageContainer")
        document.unbindArrive("#patreonImageContainer")

        this.tabs[0] = new ControlsTabApiOmegle(this.driver, this)
    }
}

export class ControlsTabApiOmegle extends ControlsTabApi {
    //TODO: need to address DRY issue
    protected hintsDict = {
        "en": [
            {
                imgcontainer: "discordImageContainer",
                href: undefined,
                src: undefined,
                strength: 4,
                enabled: true,
                text: `The extension community is hosted on <a href=\"https://discord.gg/7DYWu5RF7Y\" target='_blank' style=\"text-decoration: none!important;\">Discord</a>.<br><br>On <a href=\"https://discord.gg/7DYWu5RF7Y\" target='_blank' style=\"text-decoration: none!important;\">our Discord server</a> you can subscribe to the project news and discuss the extension with the developer and other users!`
            },
            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 6,
                enabled: (globalThis.platformSettings.get("enableTarget") && (globalThis.platformSettings.get("enableTargetCity") || globalThis.platformSettings.get("enableTargetRegion") || globalThis.platformSettings.get("enableTargetCountry"))),
                text: `You have 'target search' enabled.<br><br>The extension will now skip everyone until it finds you someone from a country/region/city that you specified in the list in the settings.<br><br>You can disable this feature in the geolocation settings.`
            },
            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 3,
                enabled: !globalThis.platformSettings.get("darkMode"),
                text: this.hintsGenerateCheckboxShorcut('darkModeCheck', 'We can turn on the dark mode for you:', 'hintDarkMode')
            },
            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 3,
                enabled: true,
                text: "You can resize the extension control panel in the bottom right corner."
            },
            {
                imgcontainer: undefined,
                href: 'https://videochat-extension.canny.io',
                src: 'https://img.shields.io/badge/upvote_features!-blue?logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAMAAAADACAMAAABlApw1AAAAS1BMVEVHcExJVPlRXPpRXPpRXPpRXfpRXPpSXflRXflSXfpSXfn%2F%2F%2F9OWvlJVfmprvxEUPlbZfqQl%2Fzy8%2F9qdPri5P7R1P57hPu9wf09Sfnh%2Bv0EAAAACnRSTlMA4kKxD5Zp6CjLlf7c5wAACDJJREFUeNrtXYuSoyoQTakYJSAPBf3%2FL7042ZkoD6NAUG6lq%2FZRZe1OH7obmoY%2B3G67pWqKGoCybe8fk7YtAaiLprrFlqqpQXuHieTegjomCKV9C5NLGQnDOdo%2FpQ3HUBUAniqgqILUL%2BHpUvpDuIL6Twhe6jcAXkZAc9x76ju8kNzrKt%2Fh9zFC0cLLSXsgEmp4San3uj%2BAFxWwKxCaEl5Wyh2B0LTwwtI2eev%2FHsHV9X%2BH4Pr6byOoSpiBlO65CMAsBGS2fu1e0QqYjRS5BvBWIFcAZiQg4wBwhEFzzwvAvclzBnU6UQGzkyK%2FJXhjQc7QACsT5GiAlQmyNMDSBCBPAH8TUQMzlSbPRdhYjqs2VwBt9UEPQpgQMs2i%2FsTogz5U1R%2FQfZpgLyV7iuwpUjjwh3wosgchPJGedaMYBs4fs3A%2BCNExSacJf8KHonoQnrBk4%2FDUfC1cjIxOBEX3oYgehEnfieHhFD6MDE8osg9FW8WIUn9D%2B187MBgxGkC8EMBIuc5jjwyjjDYrqSCIsxVDWAr%2B2Cu8o5GMcK%2FiJHIIdvvV%2F7ECQ3GMUESJYSTF46DwkaI4URwjhg8O%2Fz8jSBQlioMB4OPD%2FxsJEdwI3Mrg6B0evhLBjcpbG6o%2Ff%2FiLCJ6N2jAACLMQ%2FVUg9DgUQMgygDf0VyncoJI4JcNfWvcBBPcQAIh0zoShYz2lKjmatwK0dyV4PwjIaQAmx%2FgPncRK8X9zDILqb5hA6cg0BCInASDUqpHK1mx5P3LmemNIchcAgGBhVR8582U8USuELmCT4A8A2wJg6Ohmuo%2Bn3oKaS3ICAMIswy%2FfbhoJZKYReD8lBzD1g2Vh3TGSyGYEgXBiABiNhhYM79NiopZ%2FSxIDINKiA7LuFCzooYFgoCQpAEzFW%2F1%2FqkM%2FtS2jroVNG7C0AEwDdMSor%2FSMdeM4doz1RAtuE4HvguwHABk%2Ff1yn9mrGZ%2BIveZirKXQNARkm7HBCAIYBxCqxR5YFa14hVgh6rk%2BlJBkAZAShXA4fQdb1dmCrlAExYxJLBgDro8eWUUqocO7jycYo%2BCXWPgAQ7DZ2hmRjizkscwasL4UyFYDNn7y9ReOL2XJ7HD5qAen%2BweTNFnmZt%2BFeD2OcBIAxcgsDGNGxtYU0JmOWCIAWpCuV3peIxld2QWS4D%2FkA0Cy%2FKE9htqMQ8ZqydBP4zEM%2BMaBp%2BfJq3A%2FHKik6YJnCAoiuQ0D86YMQ21ULehWm9ZDpIEoBQDg8yGoAS1AvIGs%2B1NEkAAaHByFpnsV0KiE1YMmXzbrQKPYAIB05mDEr8o4SjAmhevX9pac2D4kUAKB0%2BYPmQfw3ecO408PYEQQpACDKtNHEroj8my4xFI4lVwubNBboHOuSnuEv8nsinQDE2QBek5A2PY2L0r%2B2hX7pqeXUpwBYbAWYc5e%2BXrEYcpTHkkyj1AlgNcEOq7MX7Pq0Cg%2Fep1iJ3QDUDMtdO1zyChC%2B3n8uIofhBADQFgD8W%2FcUUq8S%2FZ1lCu2eAfn9MPjoH9cCCsF8U0gtv9So0iFCn5967RMivf3DCRZ41rPo%2FJu1tI4htX0iE5m%2FpipsbQOYreD0BOcnhLyPvGNbILnEt8DVAXwt8LXA1wJfC3wt8LXA1wJfC3wt8LXAeqtDlKBsLYAmKpVAPwjnWwBjNvL5EJkRnKMF8KvC3mGcoQWWpTmfnoKzLUBWFeEkZ2QwJgC0PjoYT61Oe0XAGeV15jq39gIwnA0grAPghCMm9xmZVwyfcMinnyQFXBs2jsbHM86JWQgA7WQ2EYAxWhTrZ%2Ftprhpo82hID4l%2B34YlWci0KA4IAn0seJrrNnoU%2BzeD6R4kEl140q9lefuQfj3HIwT87syxGDdWI9279Lq12Edqx5MRbr56AdB9yOt81Ly66%2BNBnlePWYxLw%2Fr%2F4tcKFOfu9OiRUxvX1%2F1mM7%2Fb66h7hDoRMppwWLrr99pG0GsJMrq4Bpru%2Br15%2B%2FhwVm32sLCULSimCR4C4kP680it0Z4AzB4OFcg4AP9DevbyefeRmSqMu21g6QL0Xgy9WxEtraAj3VXeRJOlxyN5Jx8k0NIRKXeUNydo6fEYcepeytmJLF2pI5zeDr%2BlxUBA7z1FQEP0ZLurroxAttRHNhIQLr27cUMA2CkB%2BOiEoNRn1g4PdkpH91zZF3ZGgx9KAD1zmPvR7Qw%2BZ%2FXU25ui%2F5EyyB798Bo8BWMqmYv9yT%2BAgwG4e04453PvgOxnUboLNzXGsSXcAiCImoRsdc3wWYb5tw%2ByqwRyq%2Bzs%2B%2FkgO0wbSs%2BDqQjQP5yfpwwmSLLkdfsZkmDwIXMEhifoS9EzsAiH%2FCAGSRjyIqkSUTi26ig0bYgepgmL4T6zFLcqClHeQaatebWO8WNnBvNIVIXIlSjY%2BRZxJKa%2Fma8zElkkIipV2wOBjwwTGElATLpOlf3It3yRw5ytxrtiVMclTEWEyC3C0UF0PSEwojSxKWsRmZBko%2BlLfCZ8lTgyae2T9jgyabDCQFT2zLqlMCYpic1X%2B0s8%2FQHaZvwkbF7KR6ibmw8TZ6PFr0%2FIP%2BLs7KnL8yePz56%2BP%2F8HFLJ%2FwiL7R0Rut9yfccn%2BIZ38nzLK7jEp80Wy3J%2FzysyJwP%2FwSbv8HxXM%2F1nH%2FB%2FWzP9p0%2Bwfl83%2Fed%2F8H1jO%2F4nra0fynkfG83%2Fm%2FborWn3bLcUFA6EtbgekuZwbgeZ2SKr6Ujuctq5uR%2BVKRjg6%2FL%2BRcJEJtSxunlJdAUJZVDd%2FqYqTHQkEqf8Doanb80K3CVX%2FRAyxtH9CUBhAm2xivbcgpvYvQxQ1AGXb3j8mbVsCUBdHlP8P1Rl2w0Yw36sAAAAASUVORK5CYII%3D&label=Roadmap%20on%20canny.io&cacheSeconds=3600',
                strength: 3,
                enabled: true,
                text: `Our Roadmap is publicly available on <a href=\"https://videochat-extension.canny.io\" target=\"_blank\" style=\"text-decoration: none!important;\">canny.io</a>!<br><br>As a user, you can see what we are currently working on and vote for the things you want to see next!`
            },
            {
                imgcontainer: undefined,
                href: 'https://videochat-extension.canny.io',
                src: 'https://img.shields.io/badge/share_your_thoughts!-blue?logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAMAAAADACAMAAABlApw1AAAAS1BMVEVHcExJVPlRXPpRXPpRXPpRXfpRXPpSXflRXflSXfpSXfn%2F%2F%2F9OWvlJVfmprvxEUPlbZfqQl%2Fzy8%2F9qdPri5P7R1P57hPu9wf09Sfnh%2Bv0EAAAACnRSTlMA4kKxD5Zp6CjLlf7c5wAACDJJREFUeNrtXYuSoyoQTakYJSAPBf3%2FL7042ZkoD6NAUG6lq%2FZRZe1OH7obmoY%2B3G67pWqKGoCybe8fk7YtAaiLprrFlqqpQXuHieTegjomCKV9C5NLGQnDOdo%2FpQ3HUBUAniqgqILUL%2BHpUvpDuIL6Twhe6jcAXkZAc9x76ju8kNzrKt%2Fh9zFC0cLLSXsgEmp4San3uj%2BAFxWwKxCaEl5Wyh2B0LTwwtI2eev%2FHsHV9X%2BH4Pr6byOoSpiBlO65CMAsBGS2fu1e0QqYjRS5BvBWIFcAZiQg4wBwhEFzzwvAvclzBnU6UQGzkyK%2FJXhjQc7QACsT5GiAlQmyNMDSBCBPAH8TUQMzlSbPRdhYjqs2VwBt9UEPQpgQMs2i%2FsTogz5U1R%2FQfZpgLyV7iuwpUjjwh3wosgchPJGedaMYBs4fs3A%2BCNExSacJf8KHonoQnrBk4%2FDUfC1cjIxOBEX3oYgehEnfieHhFD6MDE8osg9FW8WIUn9D%2B187MBgxGkC8EMBIuc5jjwyjjDYrqSCIsxVDWAr%2B2Cu8o5GMcK%2FiJHIIdvvV%2F7ECQ3GMUESJYSTF46DwkaI4URwjhg8O%2Fz8jSBQlioMB4OPD%2FxsJEdwI3Mrg6B0evhLBjcpbG6o%2Ff%2FiLCJ6N2jAACLMQ%2FVUg9DgUQMgygDf0VyncoJI4JcNfWvcBBPcQAIh0zoShYz2lKjmatwK0dyV4PwjIaQAmx%2FgPncRK8X9zDILqb5hA6cg0BCInASDUqpHK1mx5P3LmemNIchcAgGBhVR8582U8USuELmCT4A8A2wJg6Ohmuo%2Bn3oKaS3ICAMIswy%2FfbhoJZKYReD8lBzD1g2Vh3TGSyGYEgXBiABiNhhYM79NiopZ%2FSxIDINKiA7LuFCzooYFgoCQpAEzFW%2F1%2FqkM%2FtS2jroVNG7C0AEwDdMSor%2FSMdeM4doz1RAtuE4HvguwHABk%2Ff1yn9mrGZ%2BIveZirKXQNARkm7HBCAIYBxCqxR5YFa14hVgh6rk%2BlJBkAZAShXA4fQdb1dmCrlAExYxJLBgDro8eWUUqocO7jycYo%2BCXWPgAQ7DZ2hmRjizkscwasL4UyFYDNn7y9ReOL2XJ7HD5qAen%2BweTNFnmZt%2BFeD2OcBIAxcgsDGNGxtYU0JmOWCIAWpCuV3peIxld2QWS4D%2FkA0Cy%2FKE9htqMQ8ZqydBP4zEM%2BMaBp%2BfJq3A%2FHKik6YJnCAoiuQ0D86YMQ21ULehWm9ZDpIEoBQDg8yGoAS1AvIGs%2B1NEkAAaHByFpnsV0KiE1YMmXzbrQKPYAIB05mDEr8o4SjAmhevX9pac2D4kUAKB0%2BYPmQfw3ecO408PYEQQpACDKtNHEroj8my4xFI4lVwubNBboHOuSnuEv8nsinQDE2QBek5A2PY2L0r%2B2hX7pqeXUpwBYbAWYc5e%2BXrEYcpTHkkyj1AlgNcEOq7MX7Pq0Cg%2Fep1iJ3QDUDMtdO1zyChC%2B3n8uIofhBADQFgD8W%2FcUUq8S%2FZ1lCu2eAfn9MPjoH9cCCsF8U0gtv9So0iFCn5967RMivf3DCRZ41rPo%2FJu1tI4htX0iE5m%2FpipsbQOYreD0BOcnhLyPvGNbILnEt8DVAXwt8LXA1wJfC3wt8LXA1wJfC3wt8LXAeqtDlKBsLYAmKpVAPwjnWwBjNvL5EJkRnKMF8KvC3mGcoQWWpTmfnoKzLUBWFeEkZ2QwJgC0PjoYT61Oe0XAGeV15jq39gIwnA0grAPghCMm9xmZVwyfcMinnyQFXBs2jsbHM86JWQgA7WQ2EYAxWhTrZ%2Ftprhpo82hID4l%2B34YlWci0KA4IAn0seJrrNnoU%2BzeD6R4kEl140q9lefuQfj3HIwT87syxGDdWI9279Lq12Edqx5MRbr56AdB9yOt81Ly66%2BNBnlePWYxLw%2Fr%2F4tcKFOfu9OiRUxvX1%2F1mM7%2Fb66h7hDoRMppwWLrr99pG0GsJMrq4Bpru%2Br15%2B%2FhwVm32sLCULSimCR4C4kP680it0Z4AzB4OFcg4AP9DevbyefeRmSqMu21g6QL0Xgy9WxEtraAj3VXeRJOlxyN5Jx8k0NIRKXeUNydo6fEYcepeytmJLF2pI5zeDr%2BlxUBA7z1FQEP0ZLurroxAttRHNhIQLr27cUMA2CkB%2BOiEoNRn1g4PdkpH91zZF3ZGgx9KAD1zmPvR7Qw%2BZ%2FXU25ui%2F5EyyB798Bo8BWMqmYv9yT%2BAgwG4e04453PvgOxnUboLNzXGsSXcAiCImoRsdc3wWYb5tw%2ByqwRyq%2Bzs%2B%2FkgO0wbSs%2BDqQjQP5yfpwwmSLLkdfsZkmDwIXMEhifoS9EzsAiH%2FCAGSRjyIqkSUTi26ig0bYgepgmL4T6zFLcqClHeQaatebWO8WNnBvNIVIXIlSjY%2BRZxJKa%2Fma8zElkkIipV2wOBjwwTGElATLpOlf3It3yRw5ytxrtiVMclTEWEyC3C0UF0PSEwojSxKWsRmZBko%2BlLfCZ8lTgyae2T9jgyabDCQFT2zLqlMCYpic1X%2B0s8%2FQHaZvwkbF7KR6ibmw8TZ6PFr0%2FIP%2BLs7KnL8yePz56%2BP%2F8HFLJ%2FwiL7R0Rut9yfccn%2BIZ38nzLK7jEp80Wy3J%2FzysyJwP%2FwSbv8HxXM%2F1nH%2FB%2FWzP9p0%2Bwfl83%2Fed%2F8H1jO%2F4nra0fynkfG83%2Fm%2FborWn3bLcUFA6EtbgekuZwbgeZ2SKr6Ujuctq5uR%2BVKRjg6%2FL%2BRcJEJtSxunlJdAUJZVDd%2FqYqTHQkEqf8Doanb80K3CVX%2FRAyxtH9CUBhAm2xivbcgpvYvQxQ1AGXb3j8mbVsCUBdHlP8P1Rl2w0Yw36sAAAAASUVORK5CYII%3D&label=Roadmap%20on%20canny.io&cacheSeconds=3600',
                strength: 3,
                enabled: true,
                text: `Our Roadmap is publicly available on <a href=\"https://videochat-extension.canny.io\" target=\"_blank\" style=\"text-decoration: none!important;\">canny.io</a>!<br><br>You can even suggest your own ideas for improving the extension so that other users can vote and discuss them!`
            },

            {
                imgcontainer: undefined,
                href: 'https://videochat-extension.canny.io/feature-requests',
                src: 'https://img.shields.io/badge/share_your_thoughts!-blue?logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAMAAAADACAMAAABlApw1AAAAS1BMVEVHcExJVPlRXPpRXPpRXPpRXfpRXPpSXflRXflSXfpSXfn%2F%2F%2F9OWvlJVfmprvxEUPlbZfqQl%2Fzy8%2F9qdPri5P7R1P57hPu9wf09Sfnh%2Bv0EAAAACnRSTlMA4kKxD5Zp6CjLlf7c5wAACDJJREFUeNrtXYuSoyoQTakYJSAPBf3%2FL7042ZkoD6NAUG6lq%2FZRZe1OH7obmoY%2B3G67pWqKGoCybe8fk7YtAaiLprrFlqqpQXuHieTegjomCKV9C5NLGQnDOdo%2FpQ3HUBUAniqgqILUL%2BHpUvpDuIL6Twhe6jcAXkZAc9x76ju8kNzrKt%2Fh9zFC0cLLSXsgEmp4San3uj%2BAFxWwKxCaEl5Wyh2B0LTwwtI2eev%2FHsHV9X%2BH4Pr6byOoSpiBlO65CMAsBGS2fu1e0QqYjRS5BvBWIFcAZiQg4wBwhEFzzwvAvclzBnU6UQGzkyK%2FJXhjQc7QACsT5GiAlQmyNMDSBCBPAH8TUQMzlSbPRdhYjqs2VwBt9UEPQpgQMs2i%2FsTogz5U1R%2FQfZpgLyV7iuwpUjjwh3wosgchPJGedaMYBs4fs3A%2BCNExSacJf8KHonoQnrBk4%2FDUfC1cjIxOBEX3oYgehEnfieHhFD6MDE8osg9FW8WIUn9D%2B187MBgxGkC8EMBIuc5jjwyjjDYrqSCIsxVDWAr%2B2Cu8o5GMcK%2FiJHIIdvvV%2F7ECQ3GMUESJYSTF46DwkaI4URwjhg8O%2Fz8jSBQlioMB4OPD%2FxsJEdwI3Mrg6B0evhLBjcpbG6o%2Ff%2FiLCJ6N2jAACLMQ%2FVUg9DgUQMgygDf0VyncoJI4JcNfWvcBBPcQAIh0zoShYz2lKjmatwK0dyV4PwjIaQAmx%2FgPncRK8X9zDILqb5hA6cg0BCInASDUqpHK1mx5P3LmemNIchcAgGBhVR8582U8USuELmCT4A8A2wJg6Ohmuo%2Bn3oKaS3ICAMIswy%2FfbhoJZKYReD8lBzD1g2Vh3TGSyGYEgXBiABiNhhYM79NiopZ%2FSxIDINKiA7LuFCzooYFgoCQpAEzFW%2F1%2FqkM%2FtS2jroVNG7C0AEwDdMSor%2FSMdeM4doz1RAtuE4HvguwHABk%2Ff1yn9mrGZ%2BIveZirKXQNARkm7HBCAIYBxCqxR5YFa14hVgh6rk%2BlJBkAZAShXA4fQdb1dmCrlAExYxJLBgDro8eWUUqocO7jycYo%2BCXWPgAQ7DZ2hmRjizkscwasL4UyFYDNn7y9ReOL2XJ7HD5qAen%2BweTNFnmZt%2BFeD2OcBIAxcgsDGNGxtYU0JmOWCIAWpCuV3peIxld2QWS4D%2FkA0Cy%2FKE9htqMQ8ZqydBP4zEM%2BMaBp%2BfJq3A%2FHKik6YJnCAoiuQ0D86YMQ21ULehWm9ZDpIEoBQDg8yGoAS1AvIGs%2B1NEkAAaHByFpnsV0KiE1YMmXzbrQKPYAIB05mDEr8o4SjAmhevX9pac2D4kUAKB0%2BYPmQfw3ecO408PYEQQpACDKtNHEroj8my4xFI4lVwubNBboHOuSnuEv8nsinQDE2QBek5A2PY2L0r%2B2hX7pqeXUpwBYbAWYc5e%2BXrEYcpTHkkyj1AlgNcEOq7MX7Pq0Cg%2Fep1iJ3QDUDMtdO1zyChC%2B3n8uIofhBADQFgD8W%2FcUUq8S%2FZ1lCu2eAfn9MPjoH9cCCsF8U0gtv9So0iFCn5967RMivf3DCRZ41rPo%2FJu1tI4htX0iE5m%2FpipsbQOYreD0BOcnhLyPvGNbILnEt8DVAXwt8LXA1wJfC3wt8LXA1wJfC3wt8LXAeqtDlKBsLYAmKpVAPwjnWwBjNvL5EJkRnKMF8KvC3mGcoQWWpTmfnoKzLUBWFeEkZ2QwJgC0PjoYT61Oe0XAGeV15jq39gIwnA0grAPghCMm9xmZVwyfcMinnyQFXBs2jsbHM86JWQgA7WQ2EYAxWhTrZ%2Ftprhpo82hID4l%2B34YlWci0KA4IAn0seJrrNnoU%2BzeD6R4kEl140q9lefuQfj3HIwT87syxGDdWI9279Lq12Edqx5MRbr56AdB9yOt81Ly66%2BNBnlePWYxLw%2Fr%2F4tcKFOfu9OiRUxvX1%2F1mM7%2Fb66h7hDoRMppwWLrr99pG0GsJMrq4Bpru%2Br15%2B%2FhwVm32sLCULSimCR4C4kP680it0Z4AzB4OFcg4AP9DevbyefeRmSqMu21g6QL0Xgy9WxEtraAj3VXeRJOlxyN5Jx8k0NIRKXeUNydo6fEYcepeytmJLF2pI5zeDr%2BlxUBA7z1FQEP0ZLurroxAttRHNhIQLr27cUMA2CkB%2BOiEoNRn1g4PdkpH91zZF3ZGgx9KAD1zmPvR7Qw%2BZ%2FXU25ui%2F5EyyB798Bo8BWMqmYv9yT%2BAgwG4e04453PvgOxnUboLNzXGsSXcAiCImoRsdc3wWYb5tw%2ByqwRyq%2Bzs%2B%2FkgO0wbSs%2BDqQjQP5yfpwwmSLLkdfsZkmDwIXMEhifoS9EzsAiH%2FCAGSRjyIqkSUTi26ig0bYgepgmL4T6zFLcqClHeQaatebWO8WNnBvNIVIXIlSjY%2BRZxJKa%2Fma8zElkkIipV2wOBjwwTGElATLpOlf3It3yRw5ytxrtiVMclTEWEyC3C0UF0PSEwojSxKWsRmZBko%2BlLfCZ8lTgyae2T9jgyabDCQFT2zLqlMCYpic1X%2B0s8%2FQHaZvwkbF7KR6ibmw8TZ6PFr0%2FIP%2BLs7KnL8yePz56%2BP%2F8HFLJ%2FwiL7R0Rut9yfccn%2BIZ38nzLK7jEp80Wy3J%2FzysyJwP%2FwSbv8HxXM%2F1nH%2FB%2FWzP9p0%2Bwfl83%2Fed%2F8H1jO%2F4nra0fynkfG83%2Fm%2FborWn3bLcUFA6EtbgekuZwbgeZ2SKr6Ujuctq5uR%2BVKRjg6%2FL%2BRcJEJtSxunlJdAUJZVDd%2FqYqTHQkEqf8Doanb80K3CVX%2FRAyxtH9CUBhAm2xivbcgpvYvQxQ1AGXb3j8mbVsCUBdHlP8P1Rl2w0Yw36sAAAAASUVORK5CYII%3D&label=Roadmap%20on%20canny.io&cacheSeconds=3600',
                strength: 3,
                enabled: true,
                text: `You can share your own idea for improving the extension using <a href=\"https://videochat-extension.canny.io/feature-requests\" target=\"_blank\" style=\"text-decoration: none!important;\">canny.io</a> or <a href=\"https://videochat-extension.starbase.wiki/en?request-feature-en\" target=\"_blank\" style=\"text-decoration: none!important;\">our special google form</a>!<br><br>Other users will be able to upvote and discuss your idea, and we will select the best user-suggested ideas for future releases!`
            },

            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 5,
                enabled: true,
                text: `You can report an extension-related problem using this <a href=\"https://videochat-extension.starbase.wiki/en?report-bug-en\" target=\"_blank\" style=\"text-decoration: none!important;\">google form</a>.`
            },
        ],
        "ru": [
            {
                imgcontainer: "discordImageContainer",
                href: undefined,
                src: undefined,
                strength: 4,
                enabled: true,
                text: `Сообщество расширения размещено в <a href=\"https://discord.gg/7DYWu5RF7Y\" target=\"_blank\" style=\"text-decoration: none!important;\">Discord</a>.<br><br>На <a href=\"https://discord.gg/7DYWu5RF7Y\" target=\"_blank\" style=\"text-decoration: none!important;\">нашем Discord сервере</a> вы можете следить за новостями проекта и обсудить его с разработчиком и другими пользователями!`
            },
            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 6,
                enabled: (globalThis.platformSettings.get("enableTarget") && (globalThis.platformSettings.get("enableTargetCity") || globalThis.platformSettings.get("enableTargetRegion") || globalThis.platformSettings.get("enableTargetCountry"))),
                text: `У вас включен таргетированный поиск.<br><br>Расширение будет пропускать всех ваших собеседников, пока не найдет кого-нибудь из списка стран/регионов/городов, который вы задали в настройках<br><br>Вы можете отключить эту функцию в настройках геолокации.'.`
            },
            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 3,
                enabled: !globalThis.platformSettings.get("darkMode"),
                text: this.hintsGenerateCheckboxShorcut('darkModeCheck', 'Расширение может включить тёмную тему:', 'hintDarkMode')
            },
            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 3,
                enabled: true,
                text: "Вы можете менять размер окошка расширения в правом нижнем углу."
            },

            {
                imgcontainer: undefined,
                href: 'https://videochat-extension.canny.io',
                src: 'https://img.shields.io/badge/%D0%B3%D0%BE%D0%BB%D0%BE%D1%81%D1%83%D0%B9%D1%82%D0%B5%20%D0%B7%D0%B0%20%D1%84%D0%B8%D1%87%D0%B8%21-blue?logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAMAAAADACAMAAABlApw1AAAAS1BMVEVHcExJVPlRXPpRXPpRXPpRXfpRXPpSXflRXflSXfpSXfn%2F%2F%2F9OWvlJVfmprvxEUPlbZfqQl%2Fzy8%2F9qdPri5P7R1P57hPu9wf09Sfnh%2Bv0EAAAACnRSTlMA4kKxD5Zp6CjLlf7c5wAACDJJREFUeNrtXYuSoyoQTakYJSAPBf3%2FL7042ZkoD6NAUG6lq%2FZRZe1OH7obmoY%2B3G67pWqKGoCybe8fk7YtAaiLprrFlqqpQXuHieTegjomCKV9C5NLGQnDOdo%2FpQ3HUBUAniqgqILUL%2BHpUvpDuIL6Twhe6jcAXkZAc9x76ju8kNzrKt%2Fh9zFC0cLLSXsgEmp4San3uj%2BAFxWwKxCaEl5Wyh2B0LTwwtI2eev%2FHsHV9X%2BH4Pr6byOoSpiBlO65CMAsBGS2fu1e0QqYjRS5BvBWIFcAZiQg4wBwhEFzzwvAvclzBnU6UQGzkyK%2FJXhjQc7QACsT5GiAlQmyNMDSBCBPAH8TUQMzlSbPRdhYjqs2VwBt9UEPQpgQMs2i%2FsTogz5U1R%2FQfZpgLyV7iuwpUjjwh3wosgchPJGedaMYBs4fs3A%2BCNExSacJf8KHonoQnrBk4%2FDUfC1cjIxOBEX3oYgehEnfieHhFD6MDE8osg9FW8WIUn9D%2B187MBgxGkC8EMBIuc5jjwyjjDYrqSCIsxVDWAr%2B2Cu8o5GMcK%2FiJHIIdvvV%2F7ECQ3GMUESJYSTF46DwkaI4URwjhg8O%2Fz8jSBQlioMB4OPD%2FxsJEdwI3Mrg6B0evhLBjcpbG6o%2Ff%2FiLCJ6N2jAACLMQ%2FVUg9DgUQMgygDf0VyncoJI4JcNfWvcBBPcQAIh0zoShYz2lKjmatwK0dyV4PwjIaQAmx%2FgPncRK8X9zDILqb5hA6cg0BCInASDUqpHK1mx5P3LmemNIchcAgGBhVR8582U8USuELmCT4A8A2wJg6Ohmuo%2Bn3oKaS3ICAMIswy%2FfbhoJZKYReD8lBzD1g2Vh3TGSyGYEgXBiABiNhhYM79NiopZ%2FSxIDINKiA7LuFCzooYFgoCQpAEzFW%2F1%2FqkM%2FtS2jroVNG7C0AEwDdMSor%2FSMdeM4doz1RAtuE4HvguwHABk%2Ff1yn9mrGZ%2BIveZirKXQNARkm7HBCAIYBxCqxR5YFa14hVgh6rk%2BlJBkAZAShXA4fQdb1dmCrlAExYxJLBgDro8eWUUqocO7jycYo%2BCXWPgAQ7DZ2hmRjizkscwasL4UyFYDNn7y9ReOL2XJ7HD5qAen%2BweTNFnmZt%2BFeD2OcBIAxcgsDGNGxtYU0JmOWCIAWpCuV3peIxld2QWS4D%2FkA0Cy%2FKE9htqMQ8ZqydBP4zEM%2BMaBp%2BfJq3A%2FHKik6YJnCAoiuQ0D86YMQ21ULehWm9ZDpIEoBQDg8yGoAS1AvIGs%2B1NEkAAaHByFpnsV0KiE1YMmXzbrQKPYAIB05mDEr8o4SjAmhevX9pac2D4kUAKB0%2BYPmQfw3ecO408PYEQQpACDKtNHEroj8my4xFI4lVwubNBboHOuSnuEv8nsinQDE2QBek5A2PY2L0r%2B2hX7pqeXUpwBYbAWYc5e%2BXrEYcpTHkkyj1AlgNcEOq7MX7Pq0Cg%2Fep1iJ3QDUDMtdO1zyChC%2B3n8uIofhBADQFgD8W%2FcUUq8S%2FZ1lCu2eAfn9MPjoH9cCCsF8U0gtv9So0iFCn5967RMivf3DCRZ41rPo%2FJu1tI4htX0iE5m%2FpipsbQOYreD0BOcnhLyPvGNbILnEt8DVAXwt8LXA1wJfC3wt8LXA1wJfC3wt8LXAeqtDlKBsLYAmKpVAPwjnWwBjNvL5EJkRnKMF8KvC3mGcoQWWpTmfnoKzLUBWFeEkZ2QwJgC0PjoYT61Oe0XAGeV15jq39gIwnA0grAPghCMm9xmZVwyfcMinnyQFXBs2jsbHM86JWQgA7WQ2EYAxWhTrZ%2Ftprhpo82hID4l%2B34YlWci0KA4IAn0seJrrNnoU%2BzeD6R4kEl140q9lefuQfj3HIwT87syxGDdWI9279Lq12Edqx5MRbr56AdB9yOt81Ly66%2BNBnlePWYxLw%2Fr%2F4tcKFOfu9OiRUxvX1%2F1mM7%2Fb66h7hDoRMppwWLrr99pG0GsJMrq4Bpru%2Br15%2B%2FhwVm32sLCULSimCR4C4kP680it0Z4AzB4OFcg4AP9DevbyefeRmSqMu21g6QL0Xgy9WxEtraAj3VXeRJOlxyN5Jx8k0NIRKXeUNydo6fEYcepeytmJLF2pI5zeDr%2BlxUBA7z1FQEP0ZLurroxAttRHNhIQLr27cUMA2CkB%2BOiEoNRn1g4PdkpH91zZF3ZGgx9KAD1zmPvR7Qw%2BZ%2FXU25ui%2F5EyyB798Bo8BWMqmYv9yT%2BAgwG4e04453PvgOxnUboLNzXGsSXcAiCImoRsdc3wWYb5tw%2ByqwRyq%2Bzs%2B%2FkgO0wbSs%2BDqQjQP5yfpwwmSLLkdfsZkmDwIXMEhifoS9EzsAiH%2FCAGSRjyIqkSUTi26ig0bYgepgmL4T6zFLcqClHeQaatebWO8WNnBvNIVIXIlSjY%2BRZxJKa%2Fma8zElkkIipV2wOBjwwTGElATLpOlf3It3yRw5ytxrtiVMclTEWEyC3C0UF0PSEwojSxKWsRmZBko%2BlLfCZ8lTgyae2T9jgyabDCQFT2zLqlMCYpic1X%2B0s8%2FQHaZvwkbF7KR6ibmw8TZ6PFr0%2FIP%2BLs7KnL8yePz56%2BP%2F8HFLJ%2FwiL7R0Rut9yfccn%2BIZ38nzLK7jEp80Wy3J%2FzysyJwP%2FwSbv8HxXM%2F1nH%2FB%2FWzP9p0%2Bwfl83%2Fed%2F8H1jO%2F4nra0fynkfG83%2Fm%2FborWn3bLcUFA6EtbgekuZwbgeZ2SKr6Ujuctq5uR%2BVKRjg6%2FL%2BRcJEJtSxunlJdAUJZVDd%2FqYqTHQkEqf8Doanb80K3CVX%2FRAyxtH9CUBhAm2xivbcgpvYvQxQ1AGXb3j8mbVsCUBdHlP8P1Rl2w0Yw36sAAAAASUVORK5CYII%3D&label=Roadmap%20%D0%BD%D0%B0%20canny.io&cacheSeconds=3600',
                strength: 8,
                enabled: true,
                text: `Наша roadmap публично доступна на <a href=\"https://videochat-extension.canny.io\" target=\"_blank\" style=\"text-decoration: none!important;\">canny.io</a>!<br><br>На этом сайте вы можете посмотреть над чем мы сейчас работаем и проголосовать за нужные именно вам вещи!<br><br>Сам сайт на английском языке, но вы можете использовать нашу <a href=\"https://videochat-extension.starbase.wiki/ru?request-feature-ru\" target=\"_blank\" style=\"text-decoration: none!important;\">русифицированную гугл-форму</a>, чтобы поделиться своей идеей!`
            },

            {
                imgcontainer: "reviewImageContainer",
                href: undefined,
                src: undefined,
                strength: 5,
                enabled: true,
                text: `Вы можете сообщить о проблеме, связанной с расширением, используя <a href=\"https://videochat-extension.starbase.wiki/ru?report-bug-ru\" target=\"_blank\" style=\"text-decoration: none!important;\">специальную гугл форму</a>.`
            },
        ]
    }
    public hints = this.genHintsArray()
}