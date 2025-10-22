import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function CarouselBanner() {
    return (
        <div className="flex justify-center mb-10">
            <div className="w-full max-w-7xl relative">
                <Carousel
                    showThumbs={false}
                    showStatus={false}
                    autoPlay
                    infiniteLoop
                    interval={4000}
                    stopOnHover
                    swipeable
                    emulateTouch
                >
                    {/* Slide 1 */}
                    <div className="relative">
                        <img
                            src="https://media.discordapp.net/attachments/1379159762112876585/1415029746781261894/516543702_18412087525098859_7114017648274921577_n.jpg?ex=68c1b8a5&is=68c06725&hm=e7c1923b6569ebaa102a1015654763298eef90a7b52bab66ca2fddcb47b5750b&=&format=webp"
                            alt="Banner 1"
                            className="object-cover w-full h-[450px]"
                        />
                        {/* Texto sobre imagem */}
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-start px-10 bg-black/30">
                            <div className="text-left text-white max-w-md">
                                <h2 className="text-3xl font-semibold mb-2">MUDE AGORA</h2>
                                <p className="mb-4">
                                    Encontre as tendencias mais recentes em estetica e beleza
                                    para realçar sua beleza natural
                                </p>
                                <button className="w-full bg-yellow-700 text-white text-sm py-2 rounded hover:bg-yellow-800 transition">
                                    VER MAIS
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Slide 2 */}
                    <div className="relative">
                        <img
                            src="https://clinicalucianaandrade.com.br/wp-content/uploads/2024/11/BANNER-GOOGLE-DOCTOS.jpg"
                            alt="Banner 2"
                            className="object-cover w-full h-[450px]"
                        />
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-start px-10 bg-black/30">
                            <div className="text-left text-white max-w-md">
                                <h2 className="text-3xl font-semibold mb-2">FACIAIS</h2>
                                <p className="mb-4">Explore novos produtos faciais</p>
                                <button className="w-full bg-yellow-700 text-white text-sm py-2 rounded hover:bg-yellow-800 transition">
                                    Ver produtos
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Slide 3 */}
                    <div className="relative">
                        <img
                            src="https://legalpass.com/wp-content/uploads/elementor/thumbs/insatisfacao-com-procedimento-estetico-2-scaled-qzin2qq01dp8kfi2oavbkxltsp0vxj2b4r3vj70hi8.jpg"
                            alt="Banner 3"
                            className="object-cover w-full h-[450px]"
                        />
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-start px-10 bg-black/30">
                            <div className="text-left text-white max-w-md">
                                <h2 className="text-3xl font-semibold mb-2">NOVA COLEÇÃO</h2>
                                <p className="mb-4">Descubra novos produtos</p>
                                <button className="w-full bg-yellow-900 text-white text-sm py-2 rounded hover:bg-yellow-800 transition">
                                    Explorar agora
                                </button>
                            </div>
                        </div>
                    </div>
                </Carousel>
            </div>
        </div>
    );
}
