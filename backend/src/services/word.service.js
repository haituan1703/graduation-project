const WordModel = require('../models/word.model');
const mongoose = require('mongoose');

exports.createNewWord = async (wordInfo) => {
  try {
    const newWord = await WordModel.create({ ...wordInfo });

    if (newWord) {
      return true;
    }
    return false;
  } catch (error) {
    throw error;
  }
};

exports.searchWord = async (word = '', limit = 20, select = '') => {
  try {
    const regex = new RegExp(`^${word}.*`, 'gi');
    const list = await WordModel.find({ word: regex })
      .limit(limit)
      .select(select);
    return list;
  } catch (error) {
    throw error;
  }
};

exports.getWordDetail = async (word = '') => {
  try {
    const res = await WordModel.findOne({ word });

    return res;
  } catch (error) {
    throw error;
  }
};

exports.getFavoriteList = async (rawFavorites = []) => {
  try {
    if (!Array.isArray(rawFavorites) || rawFavorites.length === 0) {
      return [];
    }

    let list = [];
    for (let word of rawFavorites) {
      const regex = new RegExp(`^${word}.*`, 'gi');
      const wordDetails = await WordModel.findOne({ word: regex }).select(
        '-_id type word mean phonetic picture',
      );
      if (wordDetails) {
        list.push(wordDetails);
      }
    }

    return list;
  } catch (error) {
    throw error;
  }
};

exports.approveWord = async (id) => {
  try {
    const isUpdated = await WordModel.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        isChecked: true,
      },
    );
    if (isUpdated.n && isUpdated.ok) {
      return { status: true, message: 'success' };
    }
    return false;
  } catch (error) {
    throw error;
  }
};

exports.fetchWords = async (search = '') => {
  try {
    const words = await WordModel.find({
      word: { $regex: search, $options: 'i' },
      isChecked: false,
    }).sort({ _id: -1 });

    return words;
  } catch (error) {
    throw error;
  }
};
