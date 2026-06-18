"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  Star,
  X
} from "lucide-react";
import type { Product } from "@/lib/products";

type TabKey =
  | "home"
  | "story"
  | "collections"
  | "craft"
  | "gallery"
  | "testimonials"
  | "showroom"
  | "contact";

const tabs: { key: TabKey; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "story", label: "Story" },
  { key: "collections", label: "Collections" },
  { key: "craft", label: "Craft" },
  { key: "gallery", label: "Gallery" },
  { key: "testimonials", label: "Testimonials" },
  { key: "showroom", label: "Showroom" },
  { key: "contact", label: "Contact" }
];

const categories = ["All", "Lounge Chairs", "Armchairs", "Sofas", "Tables", "Storage", "Ottomans"];
const pageSize = 4;

export function Storefront({ products }: { products: Product[] }) {
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;
      const matchesSearch = [product.name, product.category, product.collection, product.designer]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, products, query]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const featured = products.filter((product) => product.featured).slice(0, 3);

  function openTab(tab: TabKey) {
    setActiveTab(tab);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateCategory(category: string) {
    setActiveCategory(category);
    setPage(1);
  }

  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  return (
    <main>
      <header className="site-header">
        <button className="icon-button mobile-only" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <button className="brand" onClick={() => openTab("home")} aria-label="Tecton Woods home">
          <span>Tecton</span>
          Woods
        </button>
        <nav className="desktop-nav" aria-label="Primary tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={activeTab === tab.key ? "active" : ""}
              onClick={() => openTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <button className="header-cta" onClick={() => openTab("contact")}>
          Book Consultation
        </button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            >
              <button className="icon-button" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <X size={20} />
              </button>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  className={activeTab === tab.key ? "active" : ""}
                  onClick={() => openTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.38, ease: "easeOut" }}
        >
          {activeTab === "home" && <HomeTab products={featured} onTab={openTab} />}
          {activeTab === "story" && <StoryTab />}
          {activeTab === "collections" && (
            <CollectionsTab
              activeCategory={activeCategory}
              categories={categories}
              currentPage={currentPage}
              onCategory={updateCategory}
              onPage={setPage}
              onQuery={updateQuery}
              products={visibleProducts}
              query={query}
              totalPages={totalPages}
            />
          )}
          {activeTab === "craft" && <CraftTab />}
          {activeTab === "gallery" && <GalleryTab products={products} />}
          {activeTab === "testimonials" && <TestimonialsTab />}
          {activeTab === "showroom" && <ShowroomTab onTab={openTab} />}
          {activeTab === "contact" && <ContactTab />}
        </motion.div>
      </AnimatePresence>

      <Footer onTab={openTab} />
    </main>
  );
}

function HomeTab({ products, onTab }: { products: Product[]; onTab: (tab: TabKey) => void }) {
  return (
    <>
      <section className="hero">
        <Image
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=88"
          alt="Luxury furniture showroom"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero-overlay" />
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="eyebrow">Premium single-owner showroom</p>
          <h1>Royal furniture, quietly handcrafted.</h1>
          <p>
            Tecton Woods creates elegant custom furniture for residences,
            private lounges, and showrooms that value timeless materials and
            personal service over mass production.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => onTab("contact")}>
              Book Consultation
            </button>
            <button className="ghost-button" onClick={() => onTab("collections")}>
              View Collections
            </button>
          </div>
        </motion.div>
      </section>

      <section className="tab-section">
        <div className="section-heading">
          <p className="eyebrow">Signature pieces</p>
          <h2>Designed for rooms with presence.</h2>
        </div>
        <div className="feature-grid">
          {products.map((product, index) => (
            <ShowroomCard key={product.slug} product={product} index={index} />
          ))}
        </div>
      </section>
    </>
  );
}

function StoryTab() {
  return (
    <section className="tab-section page-intro">
      <div>
        <p className="eyebrow">Owner and brand story</p>
        <h1>A private Woods shaped by craft, patience, and royal restraint.</h1>
      </div>
      <div className="story-grid">
        <div className="story-image">
          <Image
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85"
            alt="Elegant showroom interior"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
        <div className="story-copy">
          <p>
            Tecton Woods is a single-owner furniture showroom built around
            bespoke service. Every consultation begins with the room, the
            lifestyle, and the materials that will age beautifully inside it.
          </p>
          <p>
            Our design language is royal without becoming loud: rich black,
            warm ivory, soft beige, and carefully placed gold details. The
            furniture is made for grand settings, but never at the cost of
            comfort.
          </p>
          <div className="owner-note">
            <span>Owner's note</span>
            <strong>Luxury should feel personal before it feels expensive.</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

function CollectionsTab({
  activeCategory,
  categories,
  currentPage,
  onCategory,
  onPage,
  onQuery,
  products,
  query,
  totalPages
}: {
  activeCategory: string;
  categories: string[];
  currentPage: number;
  onCategory: (category: string) => void;
  onPage: (page: number) => void;
  onQuery: (value: string) => void;
  products: Product[];
  query: string;
  totalPages: number;
}) {
  return (
    <section className="tab-section page-intro">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Signature collections</p>
          <h1>Explore pieces by room, mood, and material.</h1>
        </div>
      </div>

      <div className="collection-tools">
        <label className="search-box">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            onInput={(event) => onQuery(event.currentTarget.value)}
            placeholder="Search elegant chairs, sofas, tables"
          />
        </label>
        <div className="category-pills" aria-label="Product category filters">
          {categories.map((category) => (
            <button
              key={category}
              className={activeCategory === category ? "active" : ""}
              onClick={() => onCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="product-grid">
        <AnimatePresence mode="popLayout">
          {products.map((product, index) => (
            <ShowroomCard key={product.slug} product={product} index={index} />
          ))}
        </AnimatePresence>
      </motion.div>

      <div className="pagination" aria-label="Collection pagination">
        <button onClick={() => onPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
          <ChevronLeft size={17} />
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            className={currentPage === page ? "active" : ""}
            onClick={() => onPage(page)}
          >
            {page}
          </button>
        ))}
        <button onClick={() => onPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
          <ChevronRight size={17} />
        </button>
      </div>
    </section>
  );
}

function CraftTab() {
  const steps = [
    ["01", "Private consultation", "We study your room, routine, dimensions, light, and preferred sense of ceremony."],
    ["02", "Material selection", "Walnut, oak, velvet, boucle, leather, glass, and brass are chosen with long-term aging in mind."],
    ["03", "Hand finishing", "Each piece is shaped, upholstered, polished, and inspected by craftspeople before showroom delivery."],
    ["04", "White-glove placement", "Furniture arrives with careful installation, room alignment, and aftercare guidance."]
  ];

  return (
    <section className="tab-section page-intro">
      <p className="eyebrow">Craftsmanship process</p>
      <h1>Luxury made slowly, with every detail seen.</h1>
      <div className="process-grid">
        {steps.map(([number, title, text]) => (
          <motion.article
            key={number}
            className="process-card"
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <span>{number}</span>
            <h2>{title}</h2>
            <p>{text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function GalleryTab({ products }: { products: Product[] }) {
  return (
    <section className="tab-section page-intro">
      <p className="eyebrow">Gallery</p>
      <h1>Showroom moments in ivory, black, and gold.</h1>
      <div className="gallery-grid">
        {products.slice(0, 6).map((product, index) => (
          <motion.div
            key={product.slug}
            className={index === 0 ? "gallery-tile large" : "gallery-tile"}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <Image src={product.image} alt={product.name} fill sizes="(max-width: 900px) 100vw, 33vw" />
            <span>{product.name}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function TestimonialsTab() {
  const testimonials = [
    ["Aalia R.", "The showroom felt private, calm, and beautifully curated. The final lounge chair changed the whole room."],
    ["Dev M.", "Their team understood the house before discussing products. That made the furniture feel designed for us."],
    ["Samira K.", "The finish, upholstery, and delivery were handled with rare attention. It feels luxurious without shouting."]
  ];

  return (
    <section className="tab-section page-intro">
      <p className="eyebrow">Testimonials</p>
      <h1>Quiet praise from considered homes.</h1>
      <div className="testimonial-grid">
        {testimonials.map(([name, quote]) => (
          <article className="testimonial-card" key={name}>
            <div>
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} size={17} fill="currentColor" />
              ))}
            </div>
            <p>{quote}</p>
            <strong>{name}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function ShowroomTab({ onTab }: { onTab: (tab: TabKey) => void }) {
  return (
    <section className="tab-section page-intro">
      <p className="eyebrow">Showroom location</p>
      <h1>Visit the private Tecton Woods showroom.</h1>
      <div className="showroom-grid">
        <div className="showroom-panel">
          <MapPin size={24} />
          <h2>Mumbai Design District</h2>
          <p>14 Royal Arcade, Lower Parel, Mumbai 400013</p>
          <p>Monday to Saturday, 10:30 AM - 7:00 PM</p>
          <button className="primary-button" onClick={() => onTab("contact")}>
            Visit Showroom
          </button>
        </div>
        <div className="showroom-image">
          <Image
            src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1500&q=85"
            alt="Luxury furniture showroom seating"
            fill
            sizes="(max-width: 900px) 100vw, 55vw"
          />
        </div>
      </div>
    </section>
  );
}

function ContactTab() {
  return (
    <section className="tab-section page-intro">
      <p className="eyebrow">Contact form</p>
      <h1>Book a private consultation.</h1>
      <form className="contact-form">
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" placeholder="Your full name" />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="room">Room type</label>
          <input id="room" placeholder="Living room, bedroom, showroom" />
        </div>
        <div>
          <label htmlFor="date">Preferred date</label>
          <input id="date" placeholder="This week or next month" />
        </div>
        <div className="full">
          <label htmlFor="message">Project notes</label>
          <textarea id="message" placeholder="Tell us about the room, materials, and furniture you have in mind." />
        </div>
        <button type="button">
          <CalendarDays size={18} />
          Request Consultation
        </button>
      </form>
    </section>
  );
}

function ShowroomCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.article
      layout
      className="product-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ y: -6 }}
    >
      <Link href={`/products/${product.slug}`} className="product-image">
        <Image src={product.image} alt={product.name} fill sizes="(max-width: 800px) 100vw, 33vw" />
      </Link>
      <div className="product-copy">
        <p>{product.collection} collection</p>
        <h3>{product.name}</h3>
        <span>{product.category}</span>
      </div>
      <Link className="card-link" href={`/products/${product.slug}`}>
        View details
      </Link>
    </motion.article>
  );
}

function Footer({ onTab }: { onTab: (tab: TabKey) => void }) {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <button className="brand" onClick={() => onTab("home")}>
            <span>Tecton</span>
            Woods
          </button>
          <p>
            Bespoke white and brown furniture, handcrafted for homes, private
            lounges, and refined showroom interiors.
          </p>
          <div className="footer-socials" aria-label="Social links">
            <a href="#" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="#" aria-label="Email">
              <Mail size={18} />
            </a>
            <a href="#" aria-label="Phone">
              <Phone size={18} />
            </a>
          </div>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <h3>Explore</h3>
          <button onClick={() => onTab("story")}>Brand Story</button>
          <button onClick={() => onTab("collections")}>Collections</button>
          <button onClick={() => onTab("craft")}>Craft Process</button>
          <button onClick={() => onTab("gallery")}>Gallery</button>
          <button onClick={() => onTab("contact")}>Book Consultation</button>
        </nav>

        <div className="footer-contact">
          <h3>Showroom</h3>
          <p>
            <MapPin size={17} />
            14 Royal Arcade, Lower Parel, Mumbai 400013
          </p>
          <p>
            <Phone size={17} />
            +91 90000 00000
          </p>
          <p>
            <Clock size={17} />
            Mon - Sat, 10:30 AM - 7:00 PM
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <form className="footer-newsletter">
          <label htmlFor="footer-email">Woods notes</label>
          <div>
            <input id="footer-email" placeholder="Email address" />
            <button type="button">Subscribe</button>
          </div>
        </form>
        <p>© 2026 Tecton Woods. Crafted for bespoke interiors.</p>
      </div>
    </footer>
  );
}
