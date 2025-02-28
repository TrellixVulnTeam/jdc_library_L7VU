class JSSegmenter;

// Alias for HeapObject::IsJSSegmenter() that avoids inlining.
V8_EXPORT_PRIVATE bool IsJSSegmenter_NonInline(HeapObject o);

template <class D, class P>
class TorqueGeneratedJSSegmenter : public P {
  static_assert(std::is_same<JSSegmenter, D>::value,
    "Use this class as direct base for JSSegmenter.");
  static_assert(std::is_same<JSObject, P>::value,
    "Pass in JSObject as second template parameter for TorqueGeneratedJSSegmenter.");
 public: 
  using Super = P;
  using TorqueGeneratedClass = TorqueGeneratedJSSegmenter<D,P>;

  inline String locale() const;
  inline String locale(IsolateRoot isolates) const;
  inline void set_locale(String value, WriteBarrierMode mode = UPDATE_WRITE_BARRIER);

  inline Foreign icu_break_iterator() const;
  inline Foreign icu_break_iterator(IsolateRoot isolates) const;
  inline void set_icu_break_iterator(Foreign value, WriteBarrierMode mode = UPDATE_WRITE_BARRIER);

  inline int flags() const;
  inline void set_flags(int value);

  V8_INLINE static D cast(Object object) {
    return D(object.ptr());
  }
  V8_INLINE static D unchecked_cast(Object object) {
    return bit_cast<D>(object);
  }
#ifdef VERIFY_HEAP
  V8_EXPORT_PRIVATE void JSSegmenterVerify(Isolate* isolate);
#endif  // VERIFY_HEAP

  static constexpr int kStartOfStrongFieldsOffset = P::kHeaderSize;
  static constexpr int kLocaleOffset = P::kHeaderSize;
  static constexpr int kLocaleOffsetEnd = kLocaleOffset + kTaggedSize - 1;
  static constexpr int kIcuBreakIteratorOffset = kLocaleOffsetEnd + 1;
  static constexpr int kIcuBreakIteratorOffsetEnd = kIcuBreakIteratorOffset + kTaggedSize - 1;
  static constexpr int kFlagsOffset = kIcuBreakIteratorOffsetEnd + 1;
  static constexpr int kFlagsOffsetEnd = kFlagsOffset + kTaggedSize - 1;
  static constexpr int kEndOfStrongFieldsOffset = kFlagsOffsetEnd + 1;
  static constexpr int kStartOfWeakFieldsOffset = kFlagsOffsetEnd + 1;
  static constexpr int kEndOfWeakFieldsOffset = kFlagsOffsetEnd + 1;
  static constexpr int kHeaderSize = kFlagsOffsetEnd + 1;

  friend class Factory;

 public:
  template <class DAlias = D>
  constexpr TorqueGeneratedJSSegmenter() : P() {
    static_assert(std::is_base_of<TorqueGeneratedJSSegmenter, 
      DAlias>::value,
      "class TorqueGeneratedJSSegmenter should be used as direct base for JSSegmenter.");
  }
 protected:
  inline explicit TorqueGeneratedJSSegmenter(Address ptr);
  // Special-purpose constructor for subclasses that have fast paths where
  // their ptr() is a Smi.
  inline explicit TorqueGeneratedJSSegmenter(Address ptr, HeapObject::AllowInlineSmiStorage allow_smi);
};

