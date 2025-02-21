template <class D, class P>
JSArrayBuffer TorqueGeneratedJSArrayBufferView<D, P>::buffer() const {
  IsolateRoot isolate = GetIsolateForPtrCompr(*this);
  return TorqueGeneratedJSArrayBufferView::buffer(isolate);
}
template <class D, class P>
JSArrayBuffer TorqueGeneratedJSArrayBufferView<D, P>::buffer(IsolateRoot isolate) const {
  auto value = TaggedField<JSArrayBuffer, kBufferOffset>::load(isolate, *this);
  DCHECK(value.IsJSArrayBuffer());
  return value;
}
template <class D, class P>
void TorqueGeneratedJSArrayBufferView<D, P>::set_buffer(JSArrayBuffer value, WriteBarrierMode mode) {
  SLOW_DCHECK(value.IsJSArrayBuffer());
  WRITE_FIELD(*this, kBufferOffset, value);
  CONDITIONAL_WRITE_BARRIER(*this, kBufferOffset, value, mode);
}

template <class D, class P>
uintptr_t TorqueGeneratedJSArrayBufferView<D, P>::byte_offset() const {
  return this->template ReadField<uintptr_t>(kByteOffsetOffset);
}
template <class D, class P>
void TorqueGeneratedJSArrayBufferView<D, P>::set_byte_offset(uintptr_t value) {
  this->template WriteField<uintptr_t>(kByteOffsetOffset, value);
}

template <class D, class P>
uintptr_t TorqueGeneratedJSArrayBufferView<D, P>::byte_length() const {
  return this->template ReadField<uintptr_t>(kByteLengthOffset);
}
template <class D, class P>
void TorqueGeneratedJSArrayBufferView<D, P>::set_byte_length(uintptr_t value) {
  this->template WriteField<uintptr_t>(kByteLengthOffset, value);
}

template<class D, class P>
inline TorqueGeneratedJSArrayBufferView<D, P>::TorqueGeneratedJSArrayBufferView(Address ptr)
  : P(ptr) {
  SLOW_DCHECK(IsJSArrayBufferView_NonInline(*this));
}
template<class D, class P>
inline TorqueGeneratedJSArrayBufferView<D, P>::TorqueGeneratedJSArrayBufferView(Address ptr, HeapObject::AllowInlineSmiStorage allow_smi)
  : P(ptr, allow_smi) {
  SLOW_DCHECK((allow_smi == HeapObject::AllowInlineSmiStorage::kAllowBeingASmi && this->IsSmi()) || IsJSArrayBufferView_NonInline(*this));
}
template <class D, class P>
uintptr_t TorqueGeneratedJSTypedArray<D, P>::length() const {
  return this->template ReadField<uintptr_t>(kLengthOffset);
}
template <class D, class P>
void TorqueGeneratedJSTypedArray<D, P>::set_length(uintptr_t value) {
  this->template WriteField<uintptr_t>(kLengthOffset, value);
}

template <class D, class P>
Object TorqueGeneratedJSTypedArray<D, P>::base_pointer() const {
  IsolateRoot isolate = GetIsolateForPtrCompr(*this);
  return TorqueGeneratedJSTypedArray::base_pointer(isolate);
}
template <class D, class P>
Object TorqueGeneratedJSTypedArray<D, P>::base_pointer(IsolateRoot isolate) const {
  auto value = TaggedField<Object, kBasePointerOffset>::load(isolate, *this);
  DCHECK(value.IsSmi() || value.IsByteArray());
  return value;
}
template <class D, class P>
void TorqueGeneratedJSTypedArray<D, P>::set_base_pointer(Object value, WriteBarrierMode mode) {
  SLOW_DCHECK(value.IsSmi() || value.IsByteArray());
  WRITE_FIELD(*this, kBasePointerOffset, value);
  CONDITIONAL_WRITE_BARRIER(*this, kBasePointerOffset, value, mode);
}

template<class D, class P>
inline TorqueGeneratedJSTypedArray<D, P>::TorqueGeneratedJSTypedArray(Address ptr)
  : P(ptr) {
  SLOW_DCHECK(IsJSTypedArray_NonInline(*this));
}
template<class D, class P>
inline TorqueGeneratedJSTypedArray<D, P>::TorqueGeneratedJSTypedArray(Address ptr, HeapObject::AllowInlineSmiStorage allow_smi)
  : P(ptr, allow_smi) {
  SLOW_DCHECK((allow_smi == HeapObject::AllowInlineSmiStorage::kAllowBeingASmi && this->IsSmi()) || IsJSTypedArray_NonInline(*this));
}
template <class D, class P>
uintptr_t TorqueGeneratedJSArrayBuffer<D, P>::byte_length() const {
  return this->template ReadField<uintptr_t>(kByteLengthOffset);
}
template <class D, class P>
void TorqueGeneratedJSArrayBuffer<D, P>::set_byte_length(uintptr_t value) {
  this->template WriteField<uintptr_t>(kByteLengthOffset, value);
}

template <class D, class P>
Address TorqueGeneratedJSArrayBuffer<D, P>::extension() const {
  return this->template ReadField<Address>(kExtensionOffset);
}
template <class D, class P>
void TorqueGeneratedJSArrayBuffer<D, P>::set_extension(Address value) {
  this->template WriteField<Address>(kExtensionOffset, value);
}

template <class D, class P>
uint32_t TorqueGeneratedJSArrayBuffer<D, P>::bit_field() const {
  return this->template ReadField<uint32_t>(kBitFieldOffset);
}
template <class D, class P>
void TorqueGeneratedJSArrayBuffer<D, P>::set_bit_field(uint32_t value) {
  this->template WriteField<uint32_t>(kBitFieldOffset, value);
}

template<class D, class P>
inline TorqueGeneratedJSArrayBuffer<D, P>::TorqueGeneratedJSArrayBuffer(Address ptr)
  : P(ptr) {
  SLOW_DCHECK(IsJSArrayBuffer_NonInline(*this));
}
template<class D, class P>
inline TorqueGeneratedJSArrayBuffer<D, P>::TorqueGeneratedJSArrayBuffer(Address ptr, HeapObject::AllowInlineSmiStorage allow_smi)
  : P(ptr, allow_smi) {
  SLOW_DCHECK((allow_smi == HeapObject::AllowInlineSmiStorage::kAllowBeingASmi && this->IsSmi()) || IsJSArrayBuffer_NonInline(*this));
}
template<class D, class P>
inline TorqueGeneratedJSDataView<D, P>::TorqueGeneratedJSDataView(Address ptr)
  : P(ptr) {
  SLOW_DCHECK(IsJSDataView_NonInline(*this));
}
template<class D, class P>
inline TorqueGeneratedJSDataView<D, P>::TorqueGeneratedJSDataView(Address ptr, HeapObject::AllowInlineSmiStorage allow_smi)
  : P(ptr, allow_smi) {
  SLOW_DCHECK((allow_smi == HeapObject::AllowInlineSmiStorage::kAllowBeingASmi && this->IsSmi()) || IsJSDataView_NonInline(*this));
}
