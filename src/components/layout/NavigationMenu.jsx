import { NAV_LINKS } from '../../config/constants.js';

export default function NavigationMenu({ vertical = false, onNavigate }) {
  return (
    <nav aria-label="Principal">
      <ul className={vertical ? 'flex flex-col gap-6 py-6' : 'flex items-center gap-10'}>
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              onClick={onNavigate}
              className="text-xs uppercase tracking-luxe text-soft transition-colors duration-300 hover:text-gold"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
