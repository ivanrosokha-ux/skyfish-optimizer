import { useState } from 'react';
import PropTypes from 'prop-types';
import { renderMinecraftText } from '../../utils/minecraftText';
import styles from './MinecraftItem.module.css';

export default function MinecraftItem({
  item,
  size = 'md',
  active = false,
  onClick,
  showTooltip = true,
}) {
  const [hovered, setHovered] = useState(false);

  if (!item) return null;

  const sizeClass = size === 'sm' ? styles.slotSm : size === 'lg' ? styles.slotLg : '';
  const activeClass = active ? styles.slotActive : '';

  const fallbackTexture =
    item.slot === 'rod'
      ? '/assets/minecraft/fishing_rod.png'
      : item.slot === 'helmet'
        ? '/assets/minecraft/diamond_helmet.png'
        : item.slot === 'chest'
          ? '/assets/minecraft/diamond_chestplate.png'
          : item.slot === 'legs'
            ? '/assets/minecraft/diamond_leggings.png'
            : item.slot === 'boots'
              ? '/assets/minecraft/diamond_boots.png'
              : '/assets/minecraft/fishing_rod.png';

  const textureUrl = item.texture || fallbackTexture;

  return (
    <div
      className={styles.slotWrapper}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div className={`${styles.slot} ${sizeClass} ${activeClass}`}>
        <img
          src={textureUrl}
          alt={item.rawName || item.name}
          className={styles.texture}
          loading="lazy"
          onError={(e) => {
            if (e.target.src !== fallbackTexture) {
              e.target.src = fallbackTexture;
            }
          }}
        />
      </div>

      {/* Floating In-Game Minecraft Tooltip */}
      {showTooltip && hovered && (item.lore || item.name) && (
        <div className={styles.tooltip}>
          <div className={styles.tooltipTitle}>
            {renderMinecraftText(item.name || item.rawName)}
          </div>
          {Array.isArray(item.lore) && item.lore.length > 0 && (
            <div className={styles.tooltipLore}>
              {item.lore.map((line, index) => (
                <div key={index} className={styles.loreLine}>
                  {line ? renderMinecraftText(line) : <br />}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

MinecraftItem.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string,
    rawName: PropTypes.string,
    slot: PropTypes.string,
    rarity: PropTypes.string,
    lore: PropTypes.arrayOf(PropTypes.string),
    texture: PropTypes.string,
    stats: PropTypes.shape({
      scc: PropTypes.number,
      fishingSpeed: PropTypes.number,
      treasureChance: PropTypes.number,
      fishingWisdom: PropTypes.number,
    }),
  }),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  active: PropTypes.bool,
  onClick: PropTypes.func,
  showTooltip: PropTypes.bool,
};
