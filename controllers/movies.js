const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const WrongDataError = require('../errors/wrong-request-data');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getMovies = (req, res, next) => {
  Movie.find({}, { __v: 0 })
    .then((item) => res.send(item))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'TypeError') {
        throw new WrongDataError('Переданы некорректные данные при создании карточки');
      }
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById({ _id: req.params.movieId })
    .then((item) => {
      if (!item) {
        throw new NotFoundError('Карточка по указанному id не найдена');
      }
      if (!item.owner.equals(req.user._id)) {
        throw new ForbiddenError('Можно удалять только свои карточки');
      }
      return item;
    })
    .then((item) => {
      Movie.findByIdAndDelete({ _id: item._id })
        .then((movie) => res.send(movie))
        .catch(next);
    })
    .catch((err) => {
      if (err.statusCode === 404 || err.statusCode === 403) { next(err); }
      if (err.name === 'CastError' || err.name === 'TypeError') {
        throw new WrongDataError('Переданы некорректные данные при удалении карточки');
      }
    })
    .catch(next);
};
