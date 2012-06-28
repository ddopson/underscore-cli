module.exports = (v={ 
  circular: { deeper: { still_deeper: {}}},
}, v.circular.deeper.still_deeper.obj = v, v);
