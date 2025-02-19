const Character = require("../Models/DB.js")
const character = require("../Models/DB.js")
const mongoose = require("mongoose")

const getAll = async (req, res) => {
  try {
    // res.end('All characters')
    Character.find({})
      .then((characters) => {
        res.status(200).json(characters)
      })
  } catch (error) {
    console.log(error)
  }
}

const addCharacter = async (req, res) => {
  try {
    const character = new Character(req.body)
    character.save()
      .then((newChar) => {
        res.status(200).json(newChar)
      })
  } catch (error) {
    console.log(error)
  }
}

const updateCharacter = async (req, res) => {
  try {
    const characterData = new Character(req.body)
    const updateCharacter = await Character.findByIdAndUpdate(req.params.characterID, req.body, { new: true })
    if (!Character) {
      res.json({ message: 'Not found!' })
    } else {
      res.json(updateCharacter)
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteCharacter = async (req, res) => {
  try {
    const deleteCharacter = await Character.findByIdAndDelete(req.params.characterID)
    if (!deleteCharacter) {
      res.status(404).json({ message: 'Not found!' })
    } else {
      res.json({ message: 'Character deleted!' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getCharacterById = async (req, res) => {
  try {
    const character = await Character.findById(req.params.characterID)
    console.log(character)
    if (!character) {
      res.status(404).json({ message: 'Not found!' })
    } else {
      res.json({ character })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getAll, addCharacter, updateCharacter, deleteCharacter, getCharacterById }