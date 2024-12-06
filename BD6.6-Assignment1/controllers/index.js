let shows = [
  { showId: 1, title: "The Lion King", theatreId: 1, time: "7:00 PM" },
  { showId: 2, title: "Hamilton", theatreId: 2, time: "8:00 PM" },
  { showId: 3, title: "Wicked", theatreId: 3, time: "9:00 PM" },
  { showId: 4, title: "Les Misérables", theatreId: 1, time: "6:00 PM" },
];

function getAllShows() {
  return shows;
}

function getShowById(id) {
  return shows.find((show) => show.showId === id);
}

function addShow(show) {
  const newShow = { showId: shows.length + 1, ...show };
  shows.push(newShow);
  return newShow;
}

module.exports = { getAllShows, getShowById, addShow };
