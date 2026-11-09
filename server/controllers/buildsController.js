import { savedBuilds } from '../data/mockDb.js';

export function getBuilds(req, res) {
  return res.json({
    success: true,
    data: savedBuilds,
  });
}

export function saveBuild(req, res) {
  const { name, scc, speed, treasure, wisdom, cost, meta } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, error: 'Назва білду є обов’язковою' });
  }

  const newBuild = {
    id: Date.now().toString(),
    userId: req.user?.id || 'usr_angler_1',
    name,
    scc: Number(scc) || 0,
    speed: Number(speed) || 0,
    treasure: Number(treasure) || 12,
    wisdom: Number(wisdom) || 30,
    cost: Number(cost) || 0,
    meta: meta || `${scc}% SCC · ${speed} speed`,
  };

  savedBuilds.push(newBuild);

  return res.status(201).json({
    success: true,
    data: newBuild,
  });
}

export function deleteBuild(req, res) {
  const { id } = req.params;
  const index = savedBuilds.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Білд не знайдено' });
  }

  const [deleted] = savedBuilds.splice(index, 1);
  return res.json({
    success: true,
    data: deleted,
  });
}
