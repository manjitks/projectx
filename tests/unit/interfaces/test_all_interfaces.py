"""Tests that all interfaces are abstract and have correct request/response models."""

import pytest


class TestAllInterfacesAreAbstract:
    def test_vision_interface(self):
        from projectx.interfaces.vision import (
            VisionInterface,
            VisionRequest,
        )

        with pytest.raises(TypeError):
            VisionInterface()
        req = VisionRequest(image="test.jpg")
        assert req.prompt == "Describe this image."

    def test_stt_interface(self):
        from projectx.interfaces.speech_to_text import (
            SpeechToTextInterface,
            TranscriptionRequest,
        )

        with pytest.raises(TypeError):
            SpeechToTextInterface()
        req = TranscriptionRequest(audio="/path/to/file.mp3")
        assert req.output_format == "text"

    def test_tts_interface(self):
        from projectx.interfaces.text_to_speech import (
            TextToSpeechInterface,
            TTSRequest,
        )

        with pytest.raises(TypeError):
            TextToSpeechInterface()
        req = TTSRequest(text="Hello")
        assert req.speed == 1.0
        assert req.output_format == "mp3"

    def test_image_gen_interface(self):
        from projectx.interfaces.image_generation import (
            ImageGenerationInterface,
            ImageGenRequest,
        )

        with pytest.raises(TypeError):
            ImageGenerationInterface()
        req = ImageGenRequest(prompt="A sunset")
        assert req.width == 1024
        assert req.num_images == 1

    def test_image_to_3d_interface(self):
        from projectx.interfaces.image_to_3d import (
            ImageTo3DInterface,
            ImageTo3DRequest,
            Mesh3D,
        )

        with pytest.raises(TypeError):
            ImageTo3DInterface()
        req = ImageTo3DRequest(image="test.png")
        assert req.output_format == "stl"
        mesh = Mesh3D(
            data=b"bin", format="stl", vertices=10, faces=20, file_size_bytes=100
        )
        assert mesh.has_texture is False

    def test_embeddings_interface(self):
        from projectx.interfaces.embeddings import (
            EmbeddingRequest,
            EmbeddingsInterface,
        )

        with pytest.raises(TypeError):
            EmbeddingsInterface()
        req = EmbeddingRequest(texts=["hello"])
        assert len(req.texts) == 1
