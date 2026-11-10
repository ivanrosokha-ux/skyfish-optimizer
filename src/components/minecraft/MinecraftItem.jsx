import { useState, useRef } from 'react';
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
  const [pinned, setPinned] = useState(false);
  const [tooltipPos, setTooltipPos] = useState('top');
  const slotRef = useRef(null);

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
              : item.slot === 'necklace'
                ? '/assets/minecraft/necklace.png'
                : item.slot === 'cloak'
                  ? '/assets/minecraft/cloak.png'
                  : item.slot === 'belt'
                    ? '/assets/minecraft/belt.png'
                    : item.slot === 'gloves'
                      ? '/assets/minecraft/gloves.png'
                      : '/assets/minecraft/fishing_rod.png';

  const textureUrl = item.texture || fallbackTexture;

  const handleMouseEnter = () => {
    if (slotRef.current) {
      const rect = slotRef.current.getBoundingClientRect();
      // If element is in upper part of screen (< 360px from top), flip tooltip below the item
      if (rect.top < 360) {
        setTooltipPos('bottom');
      } else {
        setTooltipPos('top');
      }
    }
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
    // Toggle pin on click so users can freeze the tooltip and scroll freely
    setPinned((prev) => !prev);
  };

  const isVisible = showTooltip && (hovered || pinned) && (item.lore || item.name);

  return (
    <div
      ref={slotRef}
      className={styles.slotWrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
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

      {/* Floating In-Game Minecraft Tooltip (Scrollable up/down, viewport-adaptive) */}
      {isVisible && (
        <div
          className={`${styles.tooltip} ${tooltipPos === 'bottom' ? styles.tooltipBottom : styles.tooltipTop}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.tooltipTitle}>
            <span>{renderMinecraftText(item.name || item.rawName)}</span>
            {pinned && <span className={styles.pinBadge}>📌 Закріплено</span>}
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
